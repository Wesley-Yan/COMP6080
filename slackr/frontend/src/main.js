import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

console.log('Let\'s go!');


let token = null;
let userID = null;
let userEmail = null;
let currentChannel = null;
let currentMsgIdx = 0;
let inviteesDict = {};
let cnt = 0;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let firstTop = 0;

setTimeout(() => {
    document.getElementById("loading-page").style.display = "none";
}, 500);

for (const redirect of document.querySelectorAll('.redirect')) {
	const newPage = redirect.getAttribute('redirect');
	redirect.addEventListener('click', () => {
		showPage(newPage);
	});
}
    // ********************************************* /
    // *                API calls                  * /
    // ********************************************* /
const apiCallGet = (path, body, authed = false) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": authed ? `Bearer ${token}` : undefined
            }
        })
        .then((response) => {
            
            if (response.status !== 200) {
                errorPopup("invalid input");
                return;
            } else {
                // console.log(response)
                response.json().then((data) => {
                    // console.log(data)
                    if (data.error) {
                        errorPopup("Error");
                    } else {
                        resolve(data);
                    }
                });
            } 
        })  
    })
}

const apiCallPost = (path, body, authed = false) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
                "Authorization": authed ? `Bearer ${token}` : undefined
            }
        })
        .then((response) => {
            
            if (response.status !== 200) {
                errorPopup("invalid input");
                return;
            } else {
                // console.log(response)
                response.json().then((data) => {
                    // console.log(data)
                    if (data.error) {
                        errorPopup("Error");
                    } else {
                        resolve(data);
                    }
                });
            } 
        })  
    })
}

const apiCallPut = (path, body, authed = false) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
                "Authorization": authed ? `Bearer ${token}` : undefined
            }
        })
        .then((response) => {
            
            if (response.status !== 200) {
                errorPopup("invalid input");
                return;
            } else {
                // console.log(response)
                response.json().then((data) => {
                    // console.log(data)
                    if (data.error) {
                        errorPopup("Error");
                    } else {
                        resolve(data);
                    }
                });
            } 
        })  
    })
}

const apiCallDelete = (path, body, authed = false) => {
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, {
            method: "DELETE",
            body: JSON.stringify(body),
            headers: {
                "Content-type": "application/json",
                "Authorization": authed ? `Bearer ${token}` : undefined
            }
        })
        .then((response) => {
            
            if (response.status !== 200) {
                errorPopup("invalid input");
                return;
            } else {
                // console.log(response)
                response.json().then((data) => {
                    // console.log(data)
                    if (data.error) {
                        errorPopup("Error");
                    } else {
                        resolve(data);
                    }
                });
            } 
        })  
    })
}


// display a single chat page
const displayChatPage = () => {
    document.getElementById("main-chat").style.display = "grid";
    document.getElementById("channel-info-page").style.display = "none";
    document.getElementById("unjoined-channel-page").style.display = "none";
    document.getElementById("pinned-message-page").style.display = "none";
    // document.getElementById("channel-name-header").textContent = currentChannel.name;
    apiCallGet(`channel/${currentChannel}`, {}, true)
    .then((data) => {
        document.getElementById("channel-name-header").textContent = data.name;
        displayMessage();
        // console.log(data);
    })
    .catch((error) => {
        errorPopup(error);
    })
}

// display all channels
const displayChannel = () => {
    apiCallGet("channel", {}, true)
    .then((data) => {
        // console.log(channels);
        for (const channel of data.channels) {
            // console.log("hearherere")
            const channel_list = document.getElementById("channel-list");
            const channel_li = document.createElement("li");
            const channel_name = document.createElement("p");
            channel_name.setAttribute("id", `${channel.id}`);
            channel_name.textContent = channel.name;

            // give private channel a special sign to distinguish
            if (channel.private) {
                channel_name.textContent += " 🔒";
            }

            // display all visible channels
            if (!channel.private || channel.members.includes(Number(userID))) {
                channel_list.appendChild(channel_li);
                channel_li.appendChild(channel_name);
                channel_li.addEventListener("click", () => {
                    document.getElementById("profile-page").style.display = "none";
                    document.getElementById("input-message").value = "";
                    if (channel.members.includes(Number(userID))) {
                        document.getElementById("main-chat").style.display = "grid";
                        document.getElementById("channel-info-page").style.display = "none";
                        document.getElementById("unjoined-channel-page").style.display = "none";
                        document.getElementById("pinned-message-page").style.display = "none";
                        document.getElementById("channel-name-header").textContent = channel.name;
                        currentChannel = channel.id;
                        displayMessage();
                    } else {
                        document.getElementById("main-chat").style.display = "none";
                        document.getElementById("channel-info-page").style.display = "none";
                        document.getElementById("unjoined-channel-page").style.display = "flex";

                    }
                    
                    currentChannel = channel.id;
                    // displayMessage();
                })
            }
        }
    })
    .catch((error) => {
        errorPopup(error);
    })
}



let prevMsg = null;
// display messages in a single channel
const displayMessage = () => {
    firstTop = 0;
    document.getElementById("loading-page").style.display = "flex";
    setTimeout(() => {
        document.getElementById("loading-page").style.display = "none";
    }, 500);
    // clean previous messages list
    const messageList = document.getElementById("msg-container");
    while (messageList.firstChild) {
        messageList.removeChild(messageList.lastChild);
    }
    currentMsgIdx = 0;
    apiCallGet(`message/${currentChannel}?start=${currentMsgIdx}`, {}, true)
    .then((data) => {

        const pageContainer = document.getElementById("msg-container");
        for (const msg of data.messages.reverse()) {
            let msgContainer = document.createElement("div");
            let senderInfo = document.createElement("div");
            let msgInfo = document.createElement("div")
            let tooltip = document.createElement("div");
            
            if (msg.sender === Number(userID)) {
                msgContainer.setAttribute("class", "self-message");
                msgInfo.setAttribute("class", "self-msg-info");
                senderInfo.setAttribute("class", "self-info");
                tooltip.setAttribute("class", "self-tooltip-content");
            } else {
                msgContainer.setAttribute("class", "other-message");
                msgInfo.setAttribute("class", "other-msg-info");
                senderInfo.setAttribute("class", "other-info");
                tooltip.setAttribute("class", "other-tooltip-content");
            }
            
            // console.log(msg.sender === Number(userID));
            
            apiCallGet(`user/${msg.sender}`, {}, true)
            .then((data) => {
                let selfImg = document.createElement("img");
                if (data.image === null) {
                    selfImg.src = "../default.png";
                } else {
                    selfImg.src = data.image;
                }
                selfImg.setAttribute("height", 40);
                selfImg.setAttribute("width", 40);
                senderInfo.appendChild(selfImg);
                let sendTime = document.createElement("div");
                sendTime.textContent = msg.sentAt.slice(11, 19);
                senderInfo.appendChild(sendTime);
                let sender = document.createElement("div");
                sender.setAttribute("class", "sender-name");
                sender.textContent = data.name;
                if (msg.edited) {
                    sender.textContent += " (edited)";
                }
                msgInfo.appendChild(sender);
                let msgContent = document.createElement("div");
                if (msg.message !== "") {
                    // let msgContent = document.createElement("div");
                    msgContent.textContent = msg.message;
                    msgInfo.appendChild(msgContent);
                } else {
                    let img = document.createElement("img");
                    img.setAttribute("src", msg.image);
                    img.setAttribute("height", "40");
                    img.setAttribute("width", "40");
                    msgInfo.appendChild(img);

                    // give images a enlarged preview
                    img.addEventListener("click", () => {
                        let preview = document.getElementById('preview');
                        let previewImage = document.getElementById('preview-image');
                        previewImage.src = msg.image;
                        preview.style.display = 'flex';
                    })

                    document.getElementById("preview").addEventListener("click", () => {
                        let preview = document.getElementById('preview');
                        preview.style.display = 'none';
                    })
                }

                // add reaction to message
                let reactionRow = document.createElement("div");
                msgInfo.appendChild(reactionRow);
                
                let reactionType = null;
                let isReacted = false;
                let hasHeart = false;
                let hasTick = false;
                let hasSad = false;

                for (const reaction of msg.reacts) {
                    if (reaction.user === Number(userID)) {
                        isReacted = true;
                        reactionType = reaction.react;
                    }
                    if (reaction.react === "❤️" && !hasHeart) {
                        reactionRow.textContent += "❤️ ";
                        hasHeart = true;
                    }

                    if (reaction.react === "✅" && !hasTick) {
                        reactionRow.textContent += "✅ ";
                        hasTick = true;
                    }
                    if (reaction.react === "🙁" && !hasSad) {
                        reactionRow.textContent += "🙁 ";
                        hasSad = true;
                    }
                }

                let react = document.createElement("button");
                react.textContent = isReacted ? "Unreact" : "React";
                react.setAttribute("id", "react-btn");
                let edit = document.createElement("button");
                edit.textContent = "Edit";
                edit.setAttribute("id", "edit-btn");
                let pin = document.createElement("button");
                pin.textContent = msg.pinned ? "Unpin": "Pin";
                pin.setAttribute("id", "pin-btn");
                let del = document.createElement("button");
                del.textContent = "Delete";
                del.setAttribute("id", "delete-btn");

                // add a tooltip for edit, react, delete or pin
                if (msg.sender === Number(userID)) {
                    tooltip.appendChild(react);
                    tooltip.appendChild(edit);
                    tooltip.appendChild(pin);
                    tooltip.appendChild(del);
                } else {
                    tooltip.appendChild(react);
                    tooltip.appendChild(pin);
                }
                msgInfo.appendChild(tooltip);

                // show user profile when clicking name or image
                sender.addEventListener("click", () => {
                    // console.log("show profile")
                    // console.log(data);
                    
                    document.getElementById("profileModal").style.display = "block";
                    document.getElementById("profile-close-btn").addEventListener("click", () => {
                        document.getElementById("profileModal").style.display = "none";
                    })
                    const profileInfo = document.getElementById("profile-modal-info");
                    while (profileInfo.firstChild) {
                        profileInfo.removeChild(profileInfo.lastChild);
                    }
                    if (data.image) {
                        document.getElementById("userImg").src = data.image;
                    } else {
                        document.getElementById("userImg").src = "../default.png";
                    }
                    const profileName = document.createElement("p");
                    profileName.textContent = `Name: ${data.name}`;
                    const profileBio = document.createElement("p");
                    profileBio.textContent = `Bio: ${data.bio}`;
                    const profileEmail = document.createElement("p");
                    profileEmail.textContent = `Email: ${data.email}`;
                    profileInfo.appendChild(profileName);
                    profileInfo.appendChild(profileBio);
                    profileInfo.appendChild(profileEmail);
                })

                selfImg.addEventListener("click", () => {
                    // console.log("show profile")
                    // console.log(data);
                    
                    document.getElementById("profileModal").style.display = "block";
                    document.getElementById("profile-close-btn").addEventListener("click", () => {
                        document.getElementById("profileModal").style.display = "none";
                    })
                    const profileInfo = document.getElementById("profile-modal-info");
                    while (profileInfo.firstChild) {
                        profileInfo.removeChild(profileInfo.lastChild);
                    }
                    if (data.image) {
                        document.getElementById("userImg").src = data.image;
                    } else {
                        document.getElementById("userImg").src = "../default.png";
                    }
                    const profileName = document.createElement("p");
                    profileName.textContent = `Name: ${data.name}`;
                    const profileBio = document.createElement("p");
                    profileBio.textContent = `Bio: ${data.bio}`;
                    const profileEmail = document.createElement("p");
                    profileEmail.textContent = `Email: ${data.email}`;
                    profileInfo.appendChild(profileName);
                    profileInfo.appendChild(profileBio);
                    profileInfo.appendChild(profileEmail);
                })

                // delete message
                del.addEventListener("click", () => {
                    apiCallDelete(`message/${currentChannel}/${msg.id}`, {}, true)
                    .catch(error => {
                        errorPopup(error);
                    })
                    displayMessage();
                })

                // pin message
                let isPin = msg.pinned;
                pin.addEventListener("click", () => {
                    if (!isPin) {
                        apiCallPost(`message/pin/${currentChannel}/${msg.id}`, {}, true);
                        pin.textContent = "Unpin";
                        isPin = true;
                    } else {
                        apiCallPost(`message/unpin/${currentChannel}/${msg.id}`, {}, true);
                        pin.textContent = "Pin";
                        isPin = false;
                    }
                    
                })

                // edit message
                let currentMsg = msg.message;
                edit.addEventListener("click", () => {
                    document.getElementById("editModal").style.display = "block";
                    document.getElementById("edit-close-btn").addEventListener("click", () => {
                        document.getElementById("editModal").style.display = "none";
                    })
                    
                    document.getElementById("submit-edit-btn").addEventListener("click", () => {
                        const newMsg = document.getElementById("new-message").value;

                        if (newMsg === "") {
                            errorPopup("Please make valid change!");
                            document.getElementById("editModal").style.display = "none";
                        } else {
                            if (prevMsg !== msg.message) {
                                apiCallPut(`message/${currentChannel}/${msg.id}`, {
                                    message: newMsg
                                }, true)
                                .catch(error => {
                                    errorPopup(error);
                                })
                                prevMsg = msg.message;
                                // displayMessage();
                                document.getElementById("editModal").style.display = "none";
                            }
                        }
                    })
                })

                
                // react message
                react.addEventListener("click", () => {
                    
                    if (isReacted) {
                        apiCallPost(`message/unreact/${currentChannel}/${msg.id}`, {
                            react: reactionType
                        }, true)
                        .then(data => {
                            isReacted = false;
                            react.textContent = "React";
                            reactionType = null;
                            displayMessage();
                        })
                        .catch((error) => {
                            errorPopup(error);
                        })
                        
                        
                    } else {
                        document.getElementById("reactionModal").style.display = "block";
                        document.getElementById("reaction-close-btn").addEventListener("click", () => {
                            document.getElementById("reactionModal").style.display = "none";
                        })

                        document.getElementById("submit-reaction-btn").addEventListener("click", () => {
                            const isHeart = document.getElementById("heart-icon").checked;
                            const isTick = document.getElementById("tick-icon").checked;
                            const isSad = document.getElementById("sad-icon").checked;
                            if (isHeart) {
                                for (const reaction of msg.reacts) {
                                    if (reaction.user === Number(userID)) {
                                        isReacted = true;
                                        reactionType = reaction.react;
                                    }
                                }
                                if (!isReacted) {
                                    apiCallPost(`message/react/${currentChannel}/${msg.id}`, {
                                        react: "❤️"
                                    }, true)
                                    
                                    .then(data = () => {
                                        reactionType = "❤️";
                                        isReacted = true;
                                        react.textContent = "Unreact";
                                        displayMessage();
                                    })
                                    .catch((error) => {
                                        errorPopup(error);
                                    })
                                }
                                
                            } else if (isTick) {
                                for (const reaction of msg.reacts) {
                                    if (reaction.user === Number(userID)) {
                                        isReacted = true;
                                        reactionType = reaction.react;
                                    }
                                }
                                if (!isReacted) {
                                    apiCallPost(`message/react/${currentChannel}/${msg.id}`, {
                                        react: "✅"
                                    }, true)
                                    
                                    .then(data = () => {
                                        reactionType = "✅";
                                        isReacted = true;
                                        react.textContent = "Unreact";
                                        displayMessage();
                                    })
                                    .catch((error) => {
                                        errorPopup(error);
                                    })
                                }
                            } else {
                                for (const reaction of msg.reacts) {
                                    if (reaction.user === Number(userID)) {
                                        isReacted = true;
                                        reactionType = reaction.react;
                                    }
                                }
                                if (!isReacted) {
                                    apiCallPost(`message/react/${currentChannel}/${msg.id}`, {
                                        react: "🙁"
                                    }, true)
                                    
                                    .then(data = () => {
                                        reactionType = "🙁";
                                        isReacted = true;
                                        react.textContent = "Unreact";
                                        displayMessage();
                                    })
                                    .catch((error) => {
                                        errorPopup(error);
                                    })
                                }
                            }
                            
                            document.getElementById("reactionModal").style.display = "none";
                            // isReacted = true;
                            // react.textContent = "Unreact";
                        })
                        
                    }
                    cnt++;
                })
            })
            .catch((error) => {
                errorPopup(error);
            })
            
            msgContainer.appendChild(senderInfo);
            msgContainer.appendChild(msgInfo);
            pageContainer.appendChild(msgContainer);
        }

        document.getElementById("msg-container").scrollTop = document.getElementById("msg-container").scrollHeight - document.getElementById("msg-container").offsetHeight;

    })
    // update current message index
    currentMsgIdx = 25;
}

// deal with infinite scroll
document.getElementById("msg-container").addEventListener("scroll", (event) => {
    const e = event.target;
    if (e.scrollTop === 0) {
        if (firstTop === 0) {
            firstTop = 1;
            return;
        }

        document.querySelector(".loading-popup").style.display = "block";
        setTimeout(() => {
            document.querySelector(".loading-popup").style.display = "none";
        
            apiCallGet(`message/${currentChannel}?start=${currentMsgIdx}`, {}, true)
            .then((data) => {
                const pageContainer = document.getElementById("msg-container");
                for (const msg of data.messages) {
                    let msgContainer = document.createElement("div");
                    let senderInfo = document.createElement("div");
                    let msgInfo = document.createElement("div")
                    let tooltip = document.createElement("div");
                    
                    if (msg.sender === Number(userID)) {
                        msgContainer.setAttribute("class", "self-message");
                        msgInfo.setAttribute("class", "self-msg-info");
                        senderInfo.setAttribute("class", "self-info");
                        tooltip.setAttribute("class", "self-tooltip-content");
                    } else {
                        msgContainer.setAttribute("class", "other-message");
                        msgInfo.setAttribute("class", "other-msg-info");
                        senderInfo.setAttribute("class", "other-info");
                        tooltip.setAttribute("class", "other-tooltip-content");
                    }

                    
                    apiCallGet(`user/${msg.sender}`, {}, true)
                    .then((data) => {
                        let selfImg = document.createElement("img");
                        if (data.image === null) {
                            selfImg.src = "../default.png";
                        } else {
                            selfImg.src = data.image;
                        }
                        selfImg.setAttribute("height", 40);
                        selfImg.setAttribute("width", 40);
                        senderInfo.appendChild(selfImg);
                        let sendTime = document.createElement("div");
                        sendTime.textContent = msg.sentAt.slice(11, 19);
                        senderInfo.appendChild(sendTime);
                        let sender = document.createElement("div");
                        sender.setAttribute("class", "sender-name");
                        sender.textContent = data.name;
                        if (msg.edited) {
                            sender.textContent += " (edited)";
                        }
                        msgInfo.appendChild(sender);
                        let msgContent = document.createElement("div");
                        if (msg.message !== "") {
                            // let msgContent = document.createElement("div");
                            msgContent.textContent = msg.message;
                            msgInfo.appendChild(msgContent);
                        } else {
                            let img = document.createElement("img");
                            img.setAttribute("src", msg.image);
                            img.setAttribute("height", "40");
                            img.setAttribute("width", "40");
                            msgInfo.appendChild(img);

                            img.addEventListener("click", () => {
                                let preview = document.getElementById('preview');
                                let previewImage = document.getElementById('preview-image');
                                previewImage.src = msg.image;
                                preview.style.display = 'flex';
                            })
        
                            document.getElementById("preview").addEventListener("click", () => {
                                let preview = document.getElementById('preview');
                                preview.style.display = 'none';
                            })
                        }
                        let reactionRow = document.createElement("div");
                        msgInfo.appendChild(reactionRow);
                        
                        let reactionType = null;
                        let isReacted = false;
                        let hasHeart = false;
                        let hasTick = false;
                        let hasSad = false;

                        for (const reaction of msg.reacts) {
                            if (reaction.user === Number(userID)) {
                                isReacted = true;
                                reactionType = reaction.react;
                            }
                            if (reaction.react === "❤️" && !hasHeart) {
                                reactionRow.textContent += "❤️ ";
                                hasHeart = true;
                            }

                            if (reaction.react === "✅" && !hasTick) {
                                reactionRow.textContent += "✅ ";
                                hasTick = true;
                            }
                            if (reaction.react === "🙁" && !hasSad) {
                                reactionRow.textContent += "🙁 ";
                                hasSad = true;
                            }
                        }

                        let react = document.createElement("button");
                        react.textContent = isReacted ? "Unreact" : "React";
                        react.setAttribute("id", "react-btn");
                        let edit = document.createElement("button");
                        edit.textContent = "Edit";
                        edit.setAttribute("id", "edit-btn");
                        let pin = document.createElement("button");
                        pin.textContent = msg.pinned ? "Unpin": "Pin";
                        pin.setAttribute("id", "pin-btn");
                        let del = document.createElement("button");
                        del.textContent = "Delete";
                        del.setAttribute("id", "delete-btn");

                        if (msg.sender === Number(userID)) {
                            tooltip.appendChild(react);
                            tooltip.appendChild(edit);
                            tooltip.appendChild(pin);
                            tooltip.appendChild(del);
                        } else {
                            tooltip.appendChild(react);
                            tooltip.appendChild(pin);
                        }
                        msgInfo.appendChild(tooltip);


                        sender.addEventListener("click", () => {
                            
                            document.getElementById("profileModal").style.display = "block";
                            document.getElementById("profile-close-btn").addEventListener("click", () => {
                                document.getElementById("profileModal").style.display = "none";
                            })
                            const profileInfo = document.getElementById("profile-modal-info");
                            while (profileInfo.firstChild) {
                                profileInfo.removeChild(profileInfo.lastChild);
                            }
                            if (data.image) {
                                document.getElementById("userImg").src = data.image;
                            } else {
                                document.getElementById("userImg").src = "../default.png";
                            }
                            const profileName = document.createElement("p");
                            profileName.textContent = `Name: ${data.name}`;
                            const profileBio = document.createElement("p");
                            profileBio.textContent = `Bio: ${data.bio}`;
                            const profileEmail = document.createElement("p");
                            profileEmail.textContent = `Email: ${data.email}`;
                            profileInfo.appendChild(profileName);
                            profileInfo.appendChild(profileBio);
                            profileInfo.appendChild(profileEmail);
                        })

                        selfImg.addEventListener("click", () => {
                            
                            document.getElementById("profileModal").style.display = "block";
                            document.getElementById("profile-close-btn").addEventListener("click", () => {
                                document.getElementById("profileModal").style.display = "none";
                            })
                            const profileInfo = document.getElementById("profile-modal-info");
                            while (profileInfo.firstChild) {
                                profileInfo.removeChild(profileInfo.lastChild);
                            }
                            if (data.image) {
                                document.getElementById("userImg").src = data.image;
                            } else {
                                document.getElementById("userImg").src = "../default.png";
                            }
                            const profileName = document.createElement("p");
                            profileName.textContent = `Name: ${data.name}`;
                            const profileBio = document.createElement("p");
                            profileBio.textContent = `Bio: ${data.bio}`;
                            const profileEmail = document.createElement("p");
                            profileEmail.textContent = `Email: ${data.email}`;
                            profileInfo.appendChild(profileName);
                            profileInfo.appendChild(profileBio);
                            profileInfo.appendChild(profileEmail);
                        })

                        del.addEventListener("click", () => {
                            apiCallDelete(`message/${currentChannel}/${msg.id}`, {}, true)
                            .catch(error => {
                                errorPopup(error);
                            })
                            displayMessage();
                        })

                        let isPin = msg.pinned;
                        pin.addEventListener("click", () => {
                            if (!isPin) {
                                apiCallPost(`message/pin/${currentChannel}/${msg.id}`, {}, true);
                                pin.textContent = "Unpin";
                                isPin = true;
                            } else {
                                apiCallPost(`message/unpin/${currentChannel}/${msg.id}`, {}, true);
                                pin.textContent = "Pin";
                                isPin = false;
                            }
                            
                        })

                        let currentMsg = msg.message;
                        edit.addEventListener("click", () => {
                            document.getElementById("editModal").style.display = "block";
                            document.getElementById("edit-close-btn").addEventListener("click", () => {
                                document.getElementById("editModal").style.display = "none";
                            })
                            
                            document.getElementById("submit-edit-btn").addEventListener("click", () => {
                                const newMsg = document.getElementById("new-message").value;
                                if (newMsg === msg.message || newMsg === "") {
                                    errorPopup("Please make valid change!");
                                    document.getElementById("editModal").style.display = "none";
                                } else {

                                    if (prevMsg !== msg.message) {
                                        apiCallPut(`message/${currentChannel}/${msg.id}`, {
                                            message: newMsg
                                        }, true)
                                        // .then(data => {
                                        //     displayMessage();
                                        // })
                                        .catch(error => {
                                            errorPopup(error);
                                        })
                                        prevMsg = msg.message;
                                        displayMessage();
                                        document.getElementById("editModal").style.display = "none";
                                    }
                                }
                            })
                        })

                        // let isReacted = msg.reacts.length > 0;
                        react.addEventListener("click", () => {
                            
                            if (isReacted) {
                                apiCallPost(`message/unreact/${currentChannel}/${msg.id}`, {
                                    react: reactionType
                                }, true)
                                .then(data => {
                                    isReacted = false;
                                    react.textContent = "React";
                                    reactionType = null;
                                    displayMessage();
                                })

                                
                            } else {
                                document.getElementById("reactionModal").style.display = "block";
                                document.getElementById("reaction-close-btn").addEventListener("click", () => {
                                    document.getElementById("reactionModal").style.display = "none";
                                })

                                document.getElementById("submit-reaction-btn").addEventListener("click", () => {
                                    const isHeart = document.getElementById("heart-icon").checked;
                                    const isTick = document.getElementById("tick-icon").checked;
                                    const isSad = document.getElementById("sad-icon").checked;
                                    if (isHeart) {
                                        for (const reaction of msg.reacts) {
                                            if (reaction.user === Number(userID)) {
                                                isReacted = true;
                                                reactionType = reaction.react;
                                            }
                                        }
                                        if (!isReacted) {
                                            apiCallPost(`message/react/${currentChannel}/${msg.id}`, {
                                                react: "❤️"
                                            }, true)
                                            
                                            .then(data = () => {
                                                reactionType = "❤️";
                                                isReacted = true;
                                                react.textContent = "Unreact";
                                                displayMessage();
                                            })
                                        }

                                        
                                    } else if (isTick) {
                                        for (const reaction of msg.reacts) {
                                            if (reaction.user === Number(userID)) {
                                                isReacted = true;
                                                reactionType = reaction.react;
                                            }
                                        }
                                        if (!isReacted) {
                                            apiCallPost(`message/react/${currentChannel}/${msg.id}`, {
                                                react: "✅"
                                            }, true)
                                            
                                            .then(data = () => {
                                                reactionType = "✅";
                                                isReacted = true;
                                                react.textContent = "Unreact";
                                                displayMessage();
                                            })
                                        }
                                    } else {
                                        for (const reaction of msg.reacts) {
                                            if (reaction.user === Number(userID)) {
                                                isReacted = true;
                                                reactionType = reaction.react;
                                            }
                                        }
                                        if (!isReacted) {
                                            apiCallPost(`message/react/${currentChannel}/${msg.id}`, {
                                                react: "🙁"
                                            }, true)
                                            
                                            .then(data = () => {
                                                reactionType = "🙁";
                                                isReacted = true;
                                                react.textContent = "Unreact";
                                                displayMessage();
                                            })
                                        }
                                    }
                                    
                                    document.getElementById("reactionModal").style.display = "none";
                                    // isReacted = true;
                                    // react.textContent = "Unreact";
                                })
                                
                            }
                            cnt++;
                        })
                    })
                    
                    msgContainer.appendChild(senderInfo);
                    msgContainer.appendChild(msgInfo);
                    pageContainer.insertBefore(msgContainer, pageContainer.firstChild);
                }

            })
            .catch((error) => {
                errorPopup(error);
            })
            
            currentMsgIdx += 25;
        }, 500);
    }
})

const showPage = (pageName) => {
    for (const page of document.querySelectorAll('.page-block')) {
        page.style.display = "none";
    }
    if (pageName === "home") {
        document.getElementById(pageName).style.display = "grid";
        return;
    }
    document.getElementById(pageName).style.display = "block";
}

const showHomePage = () => {
    for (const page of document.querySelectorAll('.page-block')) {
        page.style.display = "none";
    }
    document.getElementById("channel-info-page").style.display = "none";
    document.getElementById("unjoined-channel-page").style.display = "none";
    document.getElementById("profile-page").style.display = "none";
    document.getElementById("pinned-message-page").style.display = "none";
    const messageList = document.getElementById("msg-container");
    while (messageList.firstChild) {
        messageList.removeChild(messageList.lastChild);
    }
    document.getElementById("home").style.display = "grid";
    const channel_list = document.getElementById("channel-list");
    while (channel_list.firstChild) {
        channel_list.removeChild(channel_list.lastChild);
    }
    document.getElementById("main-chat").style.display = "none";
    displayChannel();
}

document.getElementById("register-btn").addEventListener("click", () => {
    const email = document.getElementById("register-email").value;
    const name = document.getElementById("register-name").value;
    const password = document.getElementById("register-password").value;
    const confirmedPassword = document.getElementById("register-password-confirm").value;

    // validate registration information
    if (email === "" || name === "" || password === "" || confirmedPassword === "") {
        errorPopup("Please fill in all required inputs.");
    } else if (!emailRegex.test(String(email))) {
        errorPopup("Please enter valid email address.");
    } else if (password !== confirmedPassword) {
        errorPopup("Please confirm password correctly.");
    } else {
        apiCallPost("auth/register", {
            email: email,
            name: name,
            password: password,
        })
        .then((data) => {
            token = data.token;
            userID = data.userId;
            userEmail = email;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userID);
            localStorage.setItem("email", userEmail);
            showHomePage();
        })
        .catch(error => {
            errorPopup(error);
        })
    }
})

document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    apiCallPost("auth/login", {
        email: email,
        password: password,
    })
    .then(data => {
        token = data.token;
        userID = data.userId;
        userEmail = email;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userID);
        localStorage.setItem("email", userEmail);
        showHomePage();
    })
    .catch(error => {
        errorPopup(error);
    })
})

const errorPopup = (errorMessage) => {
    document.querySelector(".error-popup").style.display = "block";
    document.querySelector(".error-popup p").textContent = errorMessage;
    document.getElementById("close-button").addEventListener("click", () => {
        document.querySelector(".error-popup").style.display = "none";
    })
}



document.getElementById("logout").addEventListener("click", () => {
    apiCallPost("auth/logout", {}, true)
    .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        showPage("login");
        document.getElementById("login-email").value = userEmail;
        document.getElementById("login-password").value = "";
    })
    .catch(error => {
        errorPopup(error);
    })
})

const localStorageToken = localStorage.getItem("token");
const localStorageID = localStorage.getItem("userId");
const localStorageEmail = localStorage.getItem("email");
if (localStorageToken !== null) {
	token = localStorageToken;
    userID = localStorageID;
    userEmail = localStorageEmail;
}

if (token === null) {
	showPage('login');
} else {
	showHomePage();
}

// add channels
document.getElementById("add-channel-btn").addEventListener("click", () => {
    document.getElementById("createChannelModal").style.display = "block";
    document.getElementById("modal-close-btn").addEventListener("click", () => {
        document.getElementById("createChannelModal").style.display = "none";
    })
    
    
})

document.getElementById("submitChannel").addEventListener("click", () => {
    const channelName = document.getElementById("channel-name").value;
    const channelDescription = document.getElementById("channel-description").value;
    const isPrivate = document.getElementById("private").checked;
    
    if (channelName === "") {
        errorPopup("Enter a valid channel name.");
    } else {
        apiCallPost("channel", {
            name: channelName,
            private: isPrivate,
            description: channelDescription,
        }, true)
        .then(data => {
            showHomePage();
        })
        .catch(error => {
            errorPopup(error);
        })
    }
    document.getElementById("createChannelModal").style.display = "none";
})

// obtain channel information
document.getElementById("info-btn").addEventListener("click", () => {
    document.getElementById("main-chat").style.display = "none";
    document.getElementById("unjoined-channel-page").style.display = "none";
    // console.log("close main chat")
    document.getElementById("channel-info-page").style.display = "block";
    apiCallGet(`channel/${currentChannel}`, {}, true)
    .then((data) => {
        document.getElementById("channel-info-name").value = data.name;
        document.getElementById("description-info").value = data.description;
        document.getElementById("channel-status").textContent = data.private ? "Status: Private" : "Status: Public";
        document.getElementById("channel-create-time").textContent = "Create time: " + data.createdAt.slice(0, 10);
        document.getElementById("channel-creator").textContent = "Creator: " + data.creator;

    })
    .catch((error) => {
        errorPopup(error);
    })

})

// change channel information
document.getElementById("channelInfo-change-btn").addEventListener("click", () => {
    const newName = document.getElementById("channel-info-name").value;
    const newDescription = document.getElementById("description-info").value;

    apiCallPut(`channel/${currentChannel}`, {
        name: newName,
        description: newDescription,
    }, true)
    .catch(error => {
        errorPopup(error)
    })
})


// join channels
document.getElementById("join-channel-btn").addEventListener("click", () => {
    if (currentChannel) {
        apiCallPost(`channel/${currentChannel}/join`, {}, true)
        .then(data => {
            showHomePage();
            displayChatPage();
            // displayChannel();
        })
        .catch(error => {
            errorPopup(error);
        })
    }
})

// leave channels
document.getElementById("leave-btn").addEventListener("click", () => {
    if (currentChannel) {
        apiCallPost(`channel/${currentChannel}/leave`, {}, true)
        .then(data => {
            showHomePage();
            document.getElementById("main-chat").style.display = "none";
            document.getElementById("channel-info-page").style.display = "none";
            document.getElementById("unjoined-channel-page").style.display = "flex";
            
        })
        .catch(error => {
            errorPopup(error);
        })
    }
})

// invite others to current channel
document.getElementById("invite-btn").addEventListener("click", () => {
    document.getElementById("submit-invite-btn").style.display = "block";
    inviteesDict = {};
    const inviteList = document.getElementById("invite-list");
    while (inviteList.firstChild) {
        inviteList.removeChild(inviteList.lastChild);
    }

    document.getElementById("inviteModal").style.display = "block";
    document.getElementById("invite-close-btn").addEventListener("click", () => {
        document.getElementById("inviteModal").style.display = "none";
    })
    apiCallGet("user", {}, true)
    .then((userData) => {
        apiCallGet(`channel/${currentChannel}`, {}, true)
        .then((channelData) => {
            let userList = document.getElementById("invite-list");
            
            let cnt = 0;
            for (const user of userData.users) {
                if (!channelData.members.includes(user.id)) {
                    // console.log(user.id);
                    const invitee = document.createElement("div");
                    const checkbox = document.createElement("input");
                    checkbox.setAttribute("type", "checkbox");
                    invitee.appendChild(checkbox);
                    const nameLabel = document.createElement("label");
                    apiCallGet(`user/${user.id}`, {}, true)
                    .then((data) => {
                        nameLabel.textContent = data.name;
                        inviteesDict[data.name] = user.id;
                    })
                    
                    invitee.appendChild(nameLabel);
                    userList.appendChild(invitee);
                    cnt++;
                }
            }
            // if no available invitees, show a text message
            if (cnt === 0) {
                const sign = document.createElement("div");
                sign.textContent = "No available user to invite."
                userList.appendChild(sign);
                document.getElementById("submit-invite-btn").style.display = "none";
            }
        })
        .catch((error) => {
            errorPopup(error);
        })
    })
    .catch((error) => {
        errorPopup(error);
    })
})

document.getElementById("submit-invite-btn").addEventListener("click", () => {
    const invitees = document.querySelectorAll("#invite-list input[type=\"checkbox\"]");
    invitees.forEach(invitee => {
        const nameLabel = invitee.nextElementSibling;
        if (invitee.checked) {
            apiCallPost(`channel/${currentChannel}/invite`, {
                userId: inviteesDict[nameLabel.textContent]
            }, true)
            .catch((error) => {
                errorPopup(error);
            })
        }
    })
    document.getElementById("inviteModal").style.display = "none";
})

// send message in a channel
document.getElementById("send-message-btn").addEventListener("click", () => {
    const message = document.getElementById("input-message").value;
    if (document.getElementById("input-image").value !== "") {
        fileToDataUrl(document.getElementById("input-image").files[0])
        .then((data) => {
            apiCallPost(`message/${currentChannel}`, {
                message: "",
                image: data
            }, true)
            .catch(error => {
                errorPopup(error);
            })
        })
    } else {
        if (message.trim().length === 0) {
            document.getElementById("input-message").value = "";
            return;
        }
        apiCallPost(`message/${currentChannel}`, {
            message: message,
            image: ""
        }, true)
        .catch(error => {
            errorPopup(error);
        })
    }

    displayMessage();
    document.getElementById("input-message").value = "";
    document.getElementById("input-image").value = "";
})

// add a keyboard shortcut to send message when press "Enter"
document.getElementById("input-message").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("send-message-btn").click();
    }
})

// display current user profile
const displayProfile = () => {
    document.getElementById("main-chat").style.display = "none";
    document.getElementById("unjoined-channel-page").style.display = "none";
    document.getElementById("channel-info-page").style.display = "none";
    document.getElementById("profile-page").style.display = "block";

    apiCallGet(`user/${userID}`, {}, true)
    .then((data) => {
        document.getElementById("profile-name").value = data.name;
        document.getElementById("profile-bio").value = data.bio;
        document.getElementById("profile-email").value = data.email;
        if (data.image) {
            document.getElementById("profileImage").src = data.image;
        } else {
            document.getElementById("profileImage").src = "../default.png";
        }

        document.getElementById("profileImage").addEventListener("click", () => {
            let preview = document.getElementById('preview');
            let previewImage = document.getElementById('preview-image');
            previewImage.src = document.getElementById("profileImage").src;
            preview.style.display = 'flex';
        })

        document.getElementById("preview").addEventListener("click", () => {
            let preview = document.getElementById('preview');
            preview.style.display = 'none';
        })
        
        // update user profile
        document.getElementById("update-profile-btn").addEventListener("click", () => {
            const name = document.getElementById("profile-name").value;
            const bio = document.getElementById("profile-bio").value;
            const email = document.getElementById("profile-email").value;
            const password = document.getElementById("profile-password").value;
            if (document.getElementById("imageUpload").value === "") {

                if (email === data.email && name === data.name && bio === data.bio && password === "") {
                    errorPopup("Nothing to update!");
                } else {
                    apiCallPut("user", {
                        email: email === data.email ? undefined : email,
                        name: name === data.name ? undefined : name,
                        bio: bio === data.bio ? undefined : bio,
                        password: password === "" ? undefined : password
                    }, true)
                    .catch((error) => {
                        errorPopup(error);
                    })
                }      
            } else {
                fileToDataUrl(document.getElementById("imageUpload").files[0])
                .then((image) => {
                    apiCallPut("user", {
                        email: email === data.email ? undefined : email,
                        name: name === data.name ? undefined : name,
                        bio: bio === data.bio ? undefined : bio,
                        password: password === "" ? undefined : password,
                        image: image
                    }, true)
                    .catch((error) => {
                        errorPopup(error);
                    })
                    document.getElementById("profileImage").src = image;
                })
            }
            
        })
    })
    .catch((error) => {
        errorPopup(error);
    })
}

document.getElementById("profile").addEventListener("click", () => {

    displayProfile();

})

// show/hide password
document.getElementById("profile-togglePassword").onchange = () => {
    const passwordInput = document.getElementById('profile-password');
    const toggleCheckbox = document.getElementById('profile-togglePassword');
    if (toggleCheckbox.checked) {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}

// display pinned messages
let pinnedMsg = [];
const displayPinnedMsg = (msgIdx) => {
    
    apiCallGet(`message/${currentChannel}?start=${msgIdx}`, {}, true)
    .then((data) => {
        for (const msg of data.messages) {
            if (msg.pinned) {
                pinnedMsg.push(msg);
            }
        }
        if (data.messages.length === 25) {
            displayPinnedMsg(msgIdx + 25);
        } else {
            const pinnedContainer = document.getElementById("pinned-container");
            for (const msg of pinnedMsg.reverse()) {
                const msgContainer = document.createElement("div");
                const selfInfo = document.createElement("div");
                const msgInfo = document.createElement("div");
                const selfImg = document.createElement("img");

                msgContainer.setAttribute("class", "pinned-msg-container");
                selfInfo.setAttribute("class", "pinned-self-info");
                msgInfo.setAttribute("class", "pinned-msg-info");

                apiCallGet(`user/${msg.sender}`, {}, true)
                .then((data) => {
                    if (data.image === null) {
                        selfImg.src = "../default.png";
                    } else {
                        selfImg.src = data.image;
                    }
                    selfImg.setAttribute("height", 40);
                    selfImg.setAttribute("width", 40);
                    selfInfo.appendChild(selfImg);
                    let sendTime = document.createElement("div");
                    sendTime.textContent = msg.sentAt.slice(11, 19);
                    selfInfo.appendChild(sendTime);
                    let sender = document.createElement("div");
                    sender.setAttribute("class", "sender-name");
                    sender.textContent = data.name;
                    msgInfo.appendChild(sender);
                    if (msg.edited) {
                        sender.textContent += " (edited)";
                    }
                    sender.addEventListener("click", () => {
                            
                        document.getElementById("profileModal").style.display = "block";
                        document.getElementById("profile-close-btn").addEventListener("click", () => {
                            document.getElementById("profileModal").style.display = "none";
                        })
                        const profileInfo = document.getElementById("profile-modal-info");
                        while (profileInfo.firstChild) {
                            profileInfo.removeChild(profileInfo.lastChild);
                        }
                        if (data.image) {
                            document.getElementById("userImg").src = data.image;
                        } else {
                            document.getElementById("userImg").src = "../default.png";
                        }
                        const profileName = document.createElement("p");
                        profileName.textContent = `Name: ${data.name}`;
                        const profileBio = document.createElement("p");
                        profileBio.textContent = `Bio: ${data.bio}`;
                        const profileEmail = document.createElement("p");
                        profileEmail.textContent = `Email: ${data.email}`;
                        profileInfo.appendChild(profileName);
                        profileInfo.appendChild(profileBio);
                        profileInfo.appendChild(profileEmail);
                    })

                    if (msg.message !== "") {
                        let msgContent = document.createElement("div");
                        msgContent.textContent = msg.message;
                        msgInfo.appendChild(msgContent);
                    } else {
                        let img = document.createElement("img");
                        img.setAttribute("src", msg.image);
                        img.setAttribute("height", "40");
                        img.setAttribute("width", "40");
                        msgInfo.appendChild(img);
                    }

                    let reactionRow = document.createElement("div");
                    msgInfo.appendChild(reactionRow);
                    
                    
                    let hasHeart = false;
                    let hasTick = false;
                    let hasSad = false;

                    for (const reaction of msg.reacts) {
                        
                        if (reaction.react === "❤️" && !hasHeart) {
                            reactionRow.textContent += "❤️ ";
                            hasHeart = true;
                        }

                        if (reaction.react === "✅" && !hasTick) {
                            reactionRow.textContent += "✅ ";
                            hasTick = true;
                        }
                        if (reaction.react === "🙁" && !hasSad) {
                            reactionRow.textContent += "🙁 ";
                            hasSad = true;
                        }
                    }
                })
                .catch((error) => {
                    errorPopup(error);
                })
                msgContainer.appendChild(selfInfo);
                msgContainer.appendChild(msgInfo);
                pinnedContainer.appendChild(msgContainer);
            }
        }
    })
    .catch((error) => {
        errorPopup(error);
    })
}

document.getElementById("pinned-btn").addEventListener("click", () => {
    const pinnedList = document.getElementById("pinned-container");
    while (pinnedList.firstChild) {
        pinnedList.removeChild(pinnedList.lastChild);
    }
    document.getElementById("main-chat").style.display = "none";
    document.getElementById("unjoined-channel-page").style.display = "none";
    document.getElementById("channel-info-page").style.display = "none";
    document.getElementById("pinned-message-page").style.display = "block";
    pinnedMsg = [];
    displayPinnedMsg(0);

    document.getElementById("pinned-close-btn").addEventListener("click", () => {
        document.getElementById("pinned-message-page").style.display = "none";
        document.getElementById("main-chat").style.display = "grid";
        // displayMessage();
    })
})

