import React, { useState } from 'react';

export const Btn = (props) => {
  const [text, setText] = useState([]);
  const addInput = () => {
    setText([...text, '']);
  };
  // a new input field
  const inputs = text.map((text, index) => (
    <div key = {index} id={index}>
      <input
        type="text"/>
    </div>
  ));

  // a button to add one more input field
  return (
    <>
    {inputs}
    <button id = 'addInput' onClick={addInput}>Add another input</button>
    </>
  )
}

export default Btn;
