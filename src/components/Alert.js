import React from 'react'

export default function Alert(props) {

    const capitalize = (word) => {
        if (word === "danger") {
            word = "error";
        }

        let string = word;
        return string[0].toUpperCase() + string.slice(1)
    }

    return (
        <div style={{ height: '50px' }}>
            {props.alert &&
                <div>
                    <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
                        <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg}
                    </div>
                </div>}
        </div>
    )
}
