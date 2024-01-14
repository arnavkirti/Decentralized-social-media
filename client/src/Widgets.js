import React from "react";
import "./Widgets.css";
import {TwitterTimelineEmbed} from "react-twitter-embed";
import SearchIcon from "@material-ui/icons/Search";

function Widgets() {
    return(
        <div className="widgets">
            <div className="widgets_input">
                <SearchIcon className="widgets_searchIcon" />
                <input placeholder="Seach Social Chain" type="text" />
            </div>

            <div className="widgets__widgetContainer">
                <h2>What's Happening</h2>
                <TwitterTimelineEmbed sourceType="profile" screenName="AoTJewels" options={{height: 800}} />
            </div>
        </div>
    );
}

export default Widgets;