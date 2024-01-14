import React, { useState, useEffect } from "react";
import SocialChain from "./contractjson/SocialChain.json";
import "./TweetBox.css";
import Avatar from "avataaars";
import { generateRandomAvatarOptions } from "./avatar";
import { Button } from "@material-ui/core";
import axios from "axios";
import { SocialChainContractAddress } from "./config.js";
import { ethers } from "ethers";

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const SocialChainContract = new ethers.Contract(
    SocialChainContractAddress,
    SocialChain.abi,
    signer
  );

function TweetBox() {
  const [tweetMessage, setTweetMessage] = useState("");
  const [avatarOptions, setAvatarOptions] = useState("");

  const addTweet = async () => {
    let tweet = {
      tweetText: tweetMessage,
      isDeleted: false,
    };

    try {
        console.log(typeof tweet.tweetText);

        let twitterTx = await SocialChainContract.addTweet(tweet.tweetText, tweet?.isDeleted)
      

        console.log(twitterTx);
      
    } catch (error) {
      console.log("Error submitting new Tweet", error);
    }
  };

  const sendTweet = async (e) => {
    e.preventDefault();

    try {
        await addTweet();
        setTweetMessage("");
    } catch (error) {
        console.error("Error sending tweet:", error);
    }
    };

    const vote = async (e) => {
      e.preventDefault();
      window.location.href = "https://votingfeature.vercel.app/";
    }


  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    let avatar = generateRandomAvatarOptions();
    setAvatarOptions(avatar);
  }, []);

  return (
    <div className="tweetBox">
      <form>
        <div className="tweetBox__input">
          <Avatar
            style={{ width: "100px", height: "100px" }}
            avatarStyle="Circle"
            {...avatarOptions}
          />
          <input
            onChange={(e) => setTweetMessage(e.target.value)}
            value={tweetMessage}
            placeholder="    What's happening?"
            type="text"
            style={{borderRadius:'50px'}}
          />
        </div>

        <Button
          onClick={sendTweet}
          type="submit"
          className="tweetBox__tweetButton"
        >
          Tweet
        </Button>
        <Button
          onClick={vote}
          type="submit"
          className="tweetBox__addVote"
        >
          Add Poll
        </Button>
      </form>
    </div>
  );
}

export default TweetBox;
