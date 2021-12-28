import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	useCallback,
} from "react";
import { useSocket } from "./SocketContext";
import { Outlet, useNavigate } from "react-router-dom";
import Peer from "simple-peer";

const VideoContext = createContext();

const VideoProvider = ({ children }) => {
	const socket = useSocket();
	const navigate = useNavigate();

	const [allowVideo, setAllowVideo] = useState(true);
	const [allowAudio, setAllowAudio] = useState(true);
	const [stream, setStream] = useState(null);
	const [inCall, setInCall] = useState(false);
	const [convoId, setConvoId] = useState(null);
	const [peers, setPeers] = useState([]);
	const [streams, setStreams] = useState([]);
	const [accepting, setAccepting] = useState(false);

	const myVidRef = useRef(null);
	const newCallRef = useRef([]);
	const connectionRefs = useRef([]);

	const toggleVideo = _ => setAllowVideo(prev => !prev);
	const toggleAudio = _ => setAllowAudio(prev => !prev);

	const leaveCall = useCallback(
		_ => {
			console.log(connectionRefs);
			// some bug, use reload for workaround
			socket.emit("leave", { convoId });
			connectionRefs.current.forEach(c => c.peer.destroy());
			setInCall(false);
			// navigate(convoId);
		},
		[convoId, socket]
	);

	useEffect(() => {
		peers.forEach(peer => {
			console.log(peer.streams);
		});
	}, [peers]);

	useEffect(() => {
		const cons = connectionRefs.current;
		return _ => {
			cons.forEach(con => con.peer.destroy());
		};
	}, []);

	useEffect(() => {
		if (accepting && stream) {
			socket.emit("join", { convoId: convoId });
		}
	}, [accepting, convoId, socket, stream]);
	const counterRef = useRef(0);
	useEffect(() => {
		if (!socket || !myVidRef.current || !inCall) return;
		console.log("called:", ++counterRef.current);
		navigator.mediaDevices
			.getUserMedia({
				video: allowVideo,
				audio: allowAudio,
			})
			.then(curStream => {
				let stream = curStream;
				setStream(curStream);
				myVidRef.current.srcObject = curStream;
				console.log("[Setting event listeners]");

				socket.on("newCall", ({ convo, signal }) => {
					newCallRef.current.push({ convo, signal });
					console.log("[newCall]", convo, signal);
				});

				// Leave event
				socket.on("callEnded", ({ convo }) => {
					console.log("[callEnded]", convo);
					leaveCall();
					navigate("/messages/" + convo._id);
				});

				// When other userLeft
				socket.on("userLeft", ({ leaverId }) => {
					console.log("received user left ", leaverId);
					const leaverPeer = connectionRefs.current.find(
						x => x.id === leaverId
					).peer;
					if (leaverPeer) {
						console.log(
							"Someone left, destroying peer of ",
							leaverId
						);
						leaverPeer.destroy();
					}
					const peers = connectionRefs.current.filter(
						x => x.id !== leaverId
					);

					connectionRefs.current = peers;
					setPeers(peers.map(p => p.peer));
					setStreams(prev => prev.filter(x => x.id !== leaverId));
				});

				// For how many members are in the call
				const createPeer = (receiverId, callerId, stream) => {
					const peer = new Peer({
						initiator: true,
						trickle: false,
						stream,
						offerConstraints: {
							offerToReceiveAudio: true,
							offerToReceiveVideo: true,
						},
					});

					peer.on("signal", signal => {
						console.log("[signal]:", signal);
						socket.emit("peerCreated", {
							receiverId,
							signal,
							callerId,
						});
					});

					return peer;
					// socket.emit('userJoined', {receiverId,})
				};

				// For members in room to send back to me
				const addPeer = (callerId, receivedSignal, stream) => {
					const peer = new Peer({
						initiator: false,
						trickle: false,
						stream,
						answerConstraints: {
							offerToReceiveAudio: true,
							offerToReceiveVideo: true,
						},
					});

					peer.on("signal", signal => {
						console.log("[signal]:", signal);
						socket.emit("acceptingRequest", { signal, callerId });
					});
					peer.on("stream", stream => {
						setStreams(prev => [...prev, { id: callerId, stream }]);
					});

					peer.signal(receivedSignal);

					return peer;
				};

				// Joiner
				socket.on("joining", ({ members }) => {
					const peers = [];
					members.forEach(id => {
						const peer = createPeer(id, socket.id, stream);
						peers.push(peer);
						connectionRefs.current.push({
							// keep track of which this peer is to
							id,
							peer,
						});
					});
					setPeers(peers);
				});

				// Already in room
				socket.on("requestingConnection", ({ signal, callerId }) => {
					const peer = addPeer(callerId, signal, stream);
					console.log("[requestingConnection]", callerId);
					console.log("[requestingConnection]", peer);
					// Might not need it
					connectionRefs.current.push({
						// keep track of which this peer is from
						id: callerId,
						peer,
					});
					// setPeers(prev => [...prev, peer]);
				});

				// Joiner
				socket.on("acceptedRequest", ({ signal, accepterId }) => {
					const con = connectionRefs.current.find(
						x => x.id === accepterId
					);
					console.log(con);
					con.peer.signal(signal);
				});
			});
	}, [allowVideo, allowAudio, socket, inCall, myVidRef, navigate, leaveCall]);

	// Caller id is the convoId for the current caller
	const answerCall = callerId => {
		if (inCall) leaveCall();
		const answeredCall = newCallRef.current.find(
			x => x.convo._id === callerId
		);
		console.log(newCallRef.current);
		navigate("/call/" + callerId);
		setInCall(true);
		setAccepting(true);
		setConvoId(callerId);
		// const peer = new Peer({ initiator: false, trickle: false, stream });
		// // when we send signal ??
		// peer.on("signal", data => {
		// 	console.log("[Answer call]: pressed");
		// 	socket.emit("join", { signal: data, convoId: callerId });
		// });

		// peer.signal(answeredCall.signal);
	};
	// target id is convoId for the target conversation
	const call = (targetId, members) => {
		console.log(inCall);
		if (inCall) leaveCall();
		setInCall(true);
		setConvoId(targetId);
		socket.emit("call", { convoId: targetId, members });
		navigate("/call/" + targetId);

		// const peer = new Peer({ initiator: true, trickle: false, stream });

		// peer.on("signal", data => {
		// 	console.log("[Call]: pressed");
		// 	socket.emit("call", { convoId: targetId, members, signal: data });
		// });

		// socket.on("userJoined", signal => {
		// 	// create initiator false peer and add to state
		// 	peer.signal(signal);
		// });
	};
	useEffect(() => {
		console.log(stream?.getTracks());
	}, [stream]);

	return (
		<VideoContext.Provider
			value={{
				myVidRef,
				peers,
				toggleAudio,
				toggleVideo,
				allowAudio,
				allowVideo,
				call,
				answerCall,
				inCall,
				leaveCall,
				streams,
			}}>
			<Outlet />
		</VideoContext.Provider>
	);
};

export const useVideo = _ => useContext(VideoContext);

export default VideoProvider;
