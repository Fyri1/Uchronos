import React from 'react';
import Header from './HeadUser.js';
import '../components/css-files/MainPage.css';

import clock from '../components/css-files/script.js';

import axios from 'axios';

function MainPage() {
  const [posts, setPosts] = React.useState([]);
  const [postsReactions, setPostsReactions] = React.useState([]);
  const [postsComments, setpostsComments] = React.useState([]);

  const [loading, setLoading] = React.useState(false);
  clock();
  React.useEffect(() => {
    console.log('Getting fresh portion of posts');
    OnLoad();
  }, [loading]);

  async function OnLoad() {
    try {
      const response = await axios.get('http://localhost:8080/api/posts/');
      setPosts(response.data.postsArr);
      setPostsReactions(response.data.postsReactionsArr);
      setpostsComments(response.data.postsCommentsArr);

      console.log(response);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="MainPage">
      <Header />

      {loading && <div>Loading!</div>}
      <div className="MainPage_сlock">
        <div class="clock">
          <div class="hour">
            <div class="hr" id="hr"></div>
          </div>
          <div class="min">
            <div class="mn" id="mn"></div>
          </div>
          <div class="sec">
            <div class="sc" id="sc"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
