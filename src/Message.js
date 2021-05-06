import React from 'react';

const Message = ({message, type, clear}) => {
    return (
        <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-warning'} alert-dismissible fade show`} role={"alert"}>
            {message}
            <button onClick={() => clear} type="button" className="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    );
};

export default Message;
