import React, { useState } from 'react';
import PostsMultichain from './components/PostsMultichain';

function FeedMultichain() {
    const [openMultiFees, setOpenMultiFees] = useState(false);

  return   (<main className="grid grid-cols-1 md:grid-cols-2 md:max-w-3xl xl:grid-cols-3 xl:mx-w-6xl mx-auto"> 

    <button onClick={() => { if(openMultiFees){setOpenMultiFees(false)}else{setOpenMultiFees(true)}}}>CLICK</button>
  
    {openMultiFees && 
        <PostsMultichain />
    }
  
  </main>);
}

export default FeedMultichain;
