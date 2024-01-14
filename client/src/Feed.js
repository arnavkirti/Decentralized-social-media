import React, { useState, useEffect } from "react";
import TweetBox from "./TweetBox";
import Post from "./Post";
import "./Feed.css";
import FlipMove from "react-flip-move";
import axios from 'axios';
import SocialChain from './contractjson/SocialChain.json'
import { SocialChainContractAddress } from './config';
import {ethers} from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const SocialChainContract = new ethers.Contract(
  SocialChainContractAddress,
  SocialChain.abi,
  signer
);

function Feed({personal}) {
  const [posts, setPosts] = useState([]);

  const getUpdatedTweets = (allTweets, address) => {
    let updatedTweets = [];
    // Here we set a personal flag around the tweets
    for(let i=0; i<allTweets.length; i++) {
      if(allTweets[i].username.toLowerCase() === address.toLowerCase()) {
        let tweet = {
          'id': allTweets[i].id,
          'tweetText': allTweets[i].tweetText,
          'isDeleted': allTweets[i].isDeleted,
          'username': allTweets[i].username,
          'personal': true
        };
        updatedTweets.push(tweet);
      } else {
          let tweet = {
          'tweetText': allTweets[i].tweetText,
          'id': allTweets[i].id,
          'isDeleted': allTweets[i].isDeleted,
          'username': allTweets[i].username,
          'personal': false
        };
        updatedTweets.push(tweet);
      }
    }
    return updatedTweets.reverse();
  }

  const getAllTweets = async() => {
    try {

        let allTweets = await SocialChainContract.getAllTweets();
        console.log(allTweets)
        setPosts(getUpdatedTweets(allTweets, "0x230d2eEd203bEEb05c02FE91efD61f04624C5d78"));
      
    } catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllTweets();
  }, []);

  const deleteTweet = key => async() => {
    console.log(key);

    // Now we got the key, let's delete our tweet
    try {

        let deleteTweetTx = await SocialChainContract.deleteTweet(key, true);
        let allTweets = await SocialChainContract.getAllTweets();
        setPosts(getUpdatedTweets(allTweets, "0x230d2eEd203bEEb05c02FE91efD61f04624C5d78"));

    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>

      <TweetBox />

      <FlipMove>
        {posts.map((post) => (
          <Post
            key={post.id}
            displayName={post.username}
            text={post.tweetText}
            personal={post.personal}
            onClick={deleteTweet(post.id)}
          />
        ))}
      </FlipMove>
    </div>
  );
}

export default Feed;