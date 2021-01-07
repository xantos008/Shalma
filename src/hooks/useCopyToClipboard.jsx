import React from 'react';
import { toast } from 'react-toastify';

const useCopyToClipboard = (fieldName, copied = false, value = "") => {
    const [copy, setCopy] = React.useState({
        copied,
        value,
    });
    const copyToClipBoard = async copyText => {
        try {
          const value = await navigator.clipboard.writeText(copyText);
          
          setCopy(v => ({
              ...v,
              copied: true,
              value,
          }));
          toast(`Copied ${fieldName} to clipboard`, {
                type: "info",
                position: toast.POSITION.BOTTOM_LEFT
          });
        } catch (err) {
            setCopy(v => ({
                ...v,
                copied: false,
            }));
            toast(`Error in copying ${fieldName}, please try again!`, {
                type: "error",
                position: toast.POSITION.BOTTOM_LEFT
            })
        }
    };
    const resetCopyToClipboard = () => {
        setCopy({
            copied: false,
            value: ''
        });
    };
    return {
        copy,
        copyToClipBoard,
        resetCopyToClipboard
    }
}

export default useCopyToClipboard;