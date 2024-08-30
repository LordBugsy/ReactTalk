import React, { createContext, useState } from "react";

export const DataContext = createContext();

const DataProvider = ({ children }) => {
    const [localUsername, updateLocalUsername] = useState(""); // State for the username of the user
    const [localUserId, updateLocalUserId] = useState(""); // State for the user id of the user
    const [localProfileColour, updateProfileColour] = useState(1); // State for the profile colour of the user, default is 1
    
    const [joinedTalks, updateJoinedTalks] = useState([]); // State for the talks that the user has joined
    const [createdTalks, updateCreatedTalks] = useState([]); // State for the talks that the user has created

    const [selectedTalk, updateSelectedTalk] = useState("Talk"); // State for the selected talk
    const [selectedTalkId, updateSelectedTalkId] = useState("(TalkId)"); // State for the selected talk id

    const [localSearchTalk, updateLocalSearchTalk] = useState(""); // State for the search input in the search bar

    return (
        <DataContext.Provider value={{ localUsername, updateLocalUsername, localUserId, updateLocalUserId, 
            selectedTalk, updateSelectedTalk, selectedTalkId, updateSelectedTalkId, localProfileColour, updateProfileColour,
            joinedTalks, updateJoinedTalks, createdTalks, updateCreatedTalks, localSearchTalk, updateLocalSearchTalk
         }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;