//import React, { useCallback, useEffect, useState } from 'react';
import React from "react";
import styled from "styled-components";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
} from "react-table";
// A great library for fuzzy filtering/sorting items
import { matchSorter } from "match-sorter";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { getAppData } from "../services/customerApi";

const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid black;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

function timeConverter(timestamp) {
  var d = new Date(Number(timestamp)), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    ampm = "AM",
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh === 0) {
    h = 12;
  }

  // ie: 2014-03-24, 3:00 PM
  time = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;
  return time;
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [rangeValue, setRangeValue] = React.useState();

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <DateRangePicker
        value={rangeValue}
        onChange={(e) => {
          setRangeValue(e);
          const mind = e ? new Date(e[0]) : undefined;
          const maxd = e ? new Date(e[1]) : undefined;
          setFilter((old = []) => [mind ? mind.getTime() : undefined]);
          setFilter((old = []) => [old[0], maxd ? maxd.getTime() : undefined]);
        }}
      />
    </div>
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Our table component
function Table({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(0, 10)

  return (
    <div className="allTable">
      <div className="overFall">
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                    {/* Render the columns filter UI */}
                    <div>
                      {column.canFilter ? column.render("Filter") : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <br />
      </div>
      <div className="pagination">
        <div className="pageNumber">
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{" "}
          </span>
          <span>
            | Go to page:{" "}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />
          </span>{" "}
        </div>
        <div className="paginationActions">
          <button
            className="forwardPrev"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>{" "}
          <button
            className="prev"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>{" "}
          <button
            className="next"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </button>{" "}
          <button
            className="forwardNext"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
        </div>
        <div className="paginationCount">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[1, 2, 5, 10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

function Statistics() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Domen",
        accessor: "Host",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Email",
        accessor: "email",
        filter: "fuzzyText",
      },
      {
        Header: "Name",
        accessor: "name",
        filter: "fuzzyText",
      },
      {
        Header: "Referrer",
        accessor: "referrer",
        filter: "fuzzyText",
      },
      {
        Header: "Time Added",
        accessor: "time_added",
        Filter: NumberRangeColumnFilter,
        filter: "between",
        Cell: (props) => {
          //props.value will contain your date
          //you can convert your date here
          if (props.value && props.value !== null) {
            return timeConverter(props.value);
          } else {
            return "Unknown";
          }
        },
      },
      {
        Header: "Accepted Time",
        accessor: "accepted_time",
        Filter: NumberRangeColumnFilter,
        filter: "between",
        Cell: (props) => {
          //props.value will contain your date
          //you can convert your date here
          if (props.value && props.value !== null) {
            return timeConverter(props.value);
          } else {
            return "Unknown";
          }
        },
      },
      {
        Header: "Signed Up",
        accessor: "signed_up",
        Filter: NumberRangeColumnFilter,
        filter: "between",
        Cell: (props) => {
          //props.value will contain your date
          //you can convert your date here
          if (props.value && props.value !== null) {
            return timeConverter(props.value);
          } else {
            return "Unknown";
          }
        },
      },
      {
        Header: "Upgraded",
        accessor: "upgraded",
        Filter: NumberRangeColumnFilter,
        filter: "between",
        Cell: (props) => {
          //props.value will contain your date
          //you can convert your date here
          if (props.value && props.value !== null) {
            return timeConverter(props.value);
          } else {
            return "Unknown";
          }
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Reward claimed",
        accessor: "reward_claimed",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
    ],
    []
  );

  const [tableData, setTableData] = React.useState([]);

  async function getData() {
    const clientId = localStorage.getItem("client_id");
    const result = await getAppData({ client_id: clientId });
    setTableData(result);
  }

  React.useMemo(() => {
    getData();
  }, []);

  return (
    <Styles>
      <Table columns={columns} data={tableData} />
    </Styles>
  );
}

export default Statistics;
