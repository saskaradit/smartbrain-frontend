import React from 'react';
import './ImageInput.css'

const ImageInput = ({onInputChange,onPictureSubmit})=>{
  return(
    <div>
      <p className='f3 white'>
        {'This is the Magic Brain'}
      </p>
      <div className='center'>
        <div className='form pa4 br3 shaodw-5 center'>
          <input type='text' className='f4 pa2 w-70 center' placeholder='Please input image url...' onChange={onInputChange}/>
          <button className='w-30 grow f4 link ph3 pv2 dib black' onClick={onPictureSubmit}>Detect Me</button>
        </div>
      </div>
    </div>
  );
}
export default ImageInput;