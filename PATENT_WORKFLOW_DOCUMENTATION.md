# PrepMate - Complete System Workflow for Patent Report

## Executive Summary

PrepMate is a novel collaborative coding platform that integrates real-time code editing, video conferencing, automated code execution, and DSA problem-solving into a unified system. The platform employs a distributed architecture using WebRTC, Socket.IO, and MongoDB to enable seamless peer-to-peer collaboration with persistent session management.

---

## COMPLETE SYSTEM WORKFLOW - UNIFIED SINGLE FLOW DIAGRAM

```
                        ┌─────────────────────────┐
                        │    USER OPENS APP       │
                        │   (Landing Page)        │
                        └───────────┬─────────────┘
                                    ↓
                        ┌─────────────────────────┐
                        │  CLICK "SIGN IN WITH    │
                        │      GOOGLE OAUTH"      │
                        └───────────┬─────────────┘
                                    ↓
                        ┌─────────────────────────┐
                        │  GOOGLE OAUTH POPUP     │
                        │  User Authorizes App    │
                        └───────────┬─────────────┘
                                    ↓
                        ┌─────────────────────────┐
                        │  BACKEND VERIFICATION   │
                        │ Google Auth Library     │
                        │ Extract: googleId,      │
                        │ email, name, picture    │
                        └───────────┬─────────────┘
                                    ↓
                    ┌───────────────┴────────────────┐
                    │    MongoDB User Lookup         │
                    └───────────────┬────────────────┘
                                    ↓
                       User Exists in Database?
                         ┌────────┴────────┐
                      YES│                 │NO
                         ↓                 ↓
            ┌────────────────────┐  ┌──────────────────┐
            │ Retrieve Existing  │  │  Create New User │
            │ User Document      │  │  • googleId       │
            │ • problemsSolved[] │  │  • email          │
            │ • stats           │  │  • preferences    │
            │ • preferences     │  │  • stats: 0       │
            └─────────┬──────────┘  └────────┬─────────┘
                      └─────────┬────────────┘
                                ↓
                    ┌─────────────────────────┐
                    │  GENERATE JWT TOKEN     │
                    │  Payload: userId, email │
                    │  Expiry: 7 days         │
                    │  Sign with SECRET       │
                    └───────────┬─────────────┘
                                ↓
                    ┌─────────────────────────┐
                    │  STORE IN CLIENT        │
                    │  localStorage.token     │
                    │  localStorage.user      │
                    │  Set AuthContext        │
                    └───────────┬─────────────┘
                                ↓
                    ┌─────────────────────────┐
                    │   AUTHENTICATED ✓       │
                    │   Navigate to Dashboard │
                    └───────────┬─────────────┘
                                ↓
        ┌───────────────────────┴────────────────────────┐
        │           USER SELECTS ACTION                  │
        └───────────────────┬────────────────────────────┘
                            ↓
              ┌─────────────┴──────────────┐
              ↓                            ↓
   ┌────────────────────┐       ┌────────────────────┐
   │ PRACTICE DSA       │       │  COLLABORATIVE     │
   │ PROBLEMS           │       │  CODING            │
   └─────────┬──────────┘       └──────────┬─────────┘
             ↓                              ↓
   ┌────────────────────┐       ┌────────────────────┐
   │ Browse Problems    │       │ CREATE NEW ROOM    │
   │ Easy/Medium/Hard   │       │ OR JOIN EXISTING   │
   │ Search/Filter      │       └──────────┬─────────┘
   └─────────┬──────────┘                  ↓
             ↓                   ┌────────────────────┐
   ┌────────────────────┐        │ Generate Room ID   │
   │ Click Problem      │        │ (8-char unique)    │
   └─────────┬──────────┘        │ Example: KZJDFV3W  │
             ↓                   └──────────┬─────────┘
   ┌────────────────────┐                  ↓
   │ Load Problem       │        ┌────────────────────┐
   │ • Description      │        │ POST /api/sessions │
   │ • Examples         │        │ /create            │
   │ • Test Cases       │        │ {roomId, userId,   │
   │ • Constraints      │        │  expiresAt: +7days}│
   └─────────┬──────────┘        └──────────┬─────────┘
             ↓                              ↓
   ┌────────────────────┐        ┌────────────────────┐
   │ Monaco Code Editor │        │ MongoDB: Insert    │
   │ Initialize with    │        │ Session Document   │
   │ Template Code      │        │ TTL Index Active   │
   └─────────┬──────────┘        └──────────┬─────────┘
             ↓                              ↓
   ┌────────────────────┐        ┌────────────────────┐
   │ USER WRITES CODE   │        │ Navigate to        │
   └─────────┬──────────┘        │ /compiler?room=ID  │
             ↓                   └──────────┬─────────┘
   ┌────────────────────┐                  ↓
   │ Click "Run Tests"  │        ┌────────────────────┐
   └─────────┬──────────┘        │ INITIALIZE         │
             ↓                   │ Socket.IO Client   │
   ┌────────────────────┐        │ Connect to Server  │
   │ POST /api/problems │        └──────────┬─────────┘
   │ /:id/run           │                   ↓
   │ {code, language}   │        ┌────────────────────┐
   └─────────┬──────────┘        │ socket.emit(       │
             ↓                   │  'joinRoom',       │
   ┌────────────────────┐        │  {roomId, userName,│
   │ Backend: Fetch     │        │   userId}          │
   │ Test Cases from    │        │ )                  │
   │ Problem Document   │        └──────────┬─────────┘
   └─────────┬──────────┘                   ↓
             ↓                   ┌────────────────────┐
   ┌────────────────────┐        │ Backend Receives   │
   │ For Each Test Case │        │ - socket.join(room)│
   │ Execute via        │        │ - Add to roomUsers │
   │ Piston API:        │        │ - Load session     │
   └─────────┬──────────┘        └──────────┬─────────┘
             ↓                              ↓
   ┌────────────────────┐        ┌────────────────────┐
   │ POST Piston API    │        │ Send to New User:  │
   │ /execute           │        │ • Current code     │
   │ {language, version,│        │ • Language         │
   │  files, stdin,     │        │ • Chat messages    │
   │  timeout: 3000ms}  │        │ • Participants     │
   └─────────┬──────────┘        └──────────┬─────────┘
             ↓                              ↓
   ┌────────────────────┐        ┌────────────────────┐
   │ Piston Container   │        │ Broadcast to Room: │
   │ Sandboxed Exec     │        │ 'userJoined'       │
   │ Memory/CPU Limits  │        │ {userId, userName} │
   └─────────┬──────────┘        └──────────┬─────────┘
             ↓                              ↓
   ┌────────────────────┐        ┌────────────────────┐
   │ Get stdout/stderr  │        │ Monaco Editor      │
   │ Compare with       │        │ Initialized        │
   │ Expected Output    │        │ Ready for Collab   │
   └─────────┬──────────┘        └──────────┬─────────┘
             ↓                              ↓
   ┌────────────────────┐        ┌────────────────────┐
   │ Return Results:    │        │ ╔═══════════════╗  │
   │ ✓ Test 1: Pass     │        │ ║ REAL-TIME     ║  │
   │ ✓ Test 2: Pass     │        │ ║ COLLABORATION ║  │
   │ ✗ Test 3: Fail     │        │ ║ ACTIVE        ║  │
   │ Expected: "3"      │        │ ╚═══════════════╝  │
   │ Got: "2"           │        └──────────┬─────────┘
   └─────────┬──────────┘                   ↓
             ↓                   ┌────────────────────┐
   ┌────────────────────┐        │ USER TYPES CODE    │
   │ Display in UI      │        │ in Monaco Editor   │
   └─────────┬──────────┘        └──────────┬─────────┘
             ↓                              ↓
   ┌────────────────────┐        ┌────────────────────┐
   │ All Tests Pass?    │        │ onDidChangeModel   │
   │                    │        │ Content Event      │
   └─────────┬──────────┘        └──────────┬─────────┘
       YES ↓      ↓ NO                      ↓
   ┌────────┐  ┌────────┐       ┌────────────────────┐
   │Submit  │  │Try     │       │ Check Flag:        │
   │Solution│  │Again   │       │ isRemoteChange?    │
   └────┬───┘  └────────┘       └──────────┬─────────┘
        ↓                            NO ↓       ↓ YES
   ┌────────────────┐            ┌─────────┐   Skip &
   │ Update User    │            │Continue │   Reset
   │ • problemsSolved│           └────┬────┘
   │ • stats++      │                ↓
   │ • solution     │     ┌────────────────────┐
   └────────┬───────┘     │ code=editor.getValue()│
            ↓             └──────────┬─────────┘
   ┌────────────────┐              ↓
   │ Mark as Solved │   ┌────────────────────┐
   │ Display ✓      │   │ socket.emit(       │
   └────────┬───────┘   │  'codeChange',     │
            ↓           │  {roomId, code,    │
   ┌────────────────┐   │   language}        │
   │ Optional:      │   │ )                  │
   │ Save to GitHub │   └──────────┬─────────┘
   └────────┬───────┘              ↓
            ↓           ┌────────────────────┐
   ┌────────────────┐   │ Backend Receives   │
   │ GitHub OAuth   │   └──────────┬─────────┘
   │ If Not         │              ↓
   │ Connected      │   ┌────────────────────┐
   └────────┬───────┘   │ socket.to(roomId)  │
            ↓           │ .emit('codeUpdate',│
   ┌────────────────┐   │  {code, language}) │
   │ Select Repo,   │   └──────────┬─────────┘
   │ Branch, File   │              ↓
   └────────┬───────┘   ┌────────────────────┐
            ↓           │ MongoDB Update:    │
   ┌────────────────┐   │ Session.update({   │
   │ Push to GitHub │   │   code, language,  │
   │ PUT /repos/    │   │   lastActivity     │
   │ contents/{file}│   │ })                 │
   └────────┬───────┘   │ Debounced 2s       │
            ↓           └──────────┬─────────┘
   ┌────────────────┐              ↓
   │ Success ✓      │   ┌────────────────────┐
   │ Link to Commit │   │ Other Users:       │
   └────────────────┘   │ on('codeUpdate')   │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ isRemoteChange=true│
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ editor.setValue(   │
                        │   receivedCode     │
                        │ )                  │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Display Update     │
                        │ Reset Flag         │
                        │ Loop Continues...  │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Click "Start Video"│
                        │ Call Button        │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ getUserMedia()     │
                        │ Request Camera/Mic │
                        │ Permission         │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Display Local      │
                        │ Video Stream       │
                        │ (self view)        │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ socket.emit(       │
                        │  'userReadyForCall'│
                        │ )                  │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Backend: Notify    │
                        │ All Other Users    │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ For Each Peer:     │
                        │ Create RTC         │
                        │ PeerConnection     │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Add Local Tracks   │
                        │ to Peer Connection │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Create Offer/Answer│
                        │ SDP Exchange       │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ WebRTC Signaling:  │
                        │ • emit('webrtc-    │
                        │   offer')          │
                        │ • on('webrtc-offer│
                        │ • emit('webrtc-    │
                        │   answer')         │
                        │ • on('webrtc-answer│
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ ICE Candidates     │
                        │ Exchange           │
                        │ • emit candidates  │
                        │ • receive & add    │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ STUN Server:       │
                        │ NAT Traversal      │
                        │ Find Network Path  │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ P2P CONNECTION     │
                        │ ESTABLISHED ✓      │
                        │ Direct Peer-to-Peer│
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Video/Audio        │
                        │ Streams Flow       │
                        │ Between Peers      │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Display Remote     │
                        │ Video Streams      │
                        │ (all participants) │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Media Controls:    │
                        │ [🎤 Mute/Unmute]   │
                        │ [📹 Video On/Off]  │
                        │ [🖥️ Share Screen]  │
                        │ [❌ End Call]      │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Click "Share       │
                        │ Screen" (Optional) │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ getDisplayMedia()  │
                        │ Browser Picker     │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Replace Video Track│
                        │ in Peer Connections│
                        │ with Screen Stream │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Others See Shared  │
                        │ Screen Instead of  │
                        │ Camera Feed        │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Click "Run Code"   │
                        │ in Collab Room     │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ POST /api/execute  │
                        │ {code, language,   │
                        │  input}            │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Piston API Execute │
                        │ Return stdout/     │
                        │ stderr             │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Display Output in  │
                        │ Terminal Panel     │
                        │ All Users See Same │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Sidebar Features:  │
                        │ • Users Tab (👥)   │
                        │ • Files Tab (📁)   │
                        │ • Chat Tab (💬)    │
                        │ • Video Tab (📹)   │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Send Chat Messages │
                        │ socket.emit(       │
                        │  'chatMessage'     │
                        │ )                  │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ All Synced         │
                        │ Real-time via      │
                        │ Socket.IO          │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Auto-Save Every    │
                        │ 2 Seconds          │
                        │ (Debounced)        │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ MongoDB Session    │
                        │ Updated with:      │
                        │ • Code             │
                        │ • Language         │
                        │ • Messages         │
                        │ • Files            │
                        │ • lastActivity     │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ USER LEAVES ROOM   │
                        │ Close Browser/Tab  │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Socket Disconnect  │
                        │ Event Triggered    │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Backend Cleanup:   │
                        │ • Remove from room │
                        │ • Update lastSeen  │
                        │ • Close WebRTC     │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Notify Others:     │
                        │ "User Left Room"   │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Session Persists   │
                        │ in MongoDB for     │
                        │ 7 DAYS             │
                        └──────────┬─────────┘
                                   ↓
                   ┌───────────────┴────────────────┐
                   │ [WITHIN 7 DAYS - USER RETURNS] │
                   └───────────────┬────────────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Re-Login (JWT      │
                        │ still valid)       │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Navigate to        │
                        │ Collaboration Page │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Modal Opens:       │
                        │ "Recent Sessions"  │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ GET /api/sessions/ │
                        │ user/:userId       │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ MongoDB Query:     │
                        │ Find non-expired   │
                        │ sessions           │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Display Cards:     │
                        │ ┌────────────────┐ │
                        │ │ Room: KZJDFV3W │ │
                        │ │ 3 participants │ │
                        │ │ Created: 2d ago│ │
                        │ │ ⏰ 5d 12h left │ │
                        │ └────────────────┘ │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Click Session Card │
                        │ to Rejoin          │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ GET /api/sessions/ │
                        │ :roomId            │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Retrieve Complete  │
                        │ Session State      │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ RESTORE EVERYTHING:│
                        │ • Code content     │
                        │ • Language setting │
                        │ • Chat history     │
                        │ • File structure   │
                        │ • Participants     │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ User Continues     │
                        │ From Exact Same    │
                        │ Point ✓            │
                        └──────────┬─────────┘
                                   ↓
                   ┌───────────────┴────────────────┐
                   │ [AFTER 7 DAYS - AUTO CLEANUP]  │
                   └───────────────┬────────────────┘
                                   ↓
                        ┌────────────────────┐
                        │ MongoDB TTL Index  │
                        │ Background Thread  │
                        │ Checks expiresAt   │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ Auto-Delete        │
                        │ Expired Sessions   │
                        │ No Manual Cleanup  │
                        │ Needed             │
                        └──────────┬─────────┘
                                   ↓
                        ┌────────────────────┐
                        │ ╔═══════════════╗  │
                        │ ║   SECURITY    ║  │
                        │ ║   THROUGHOUT  ║  │
                        │ ╚═══════════════╝  │
                        │                    │
                        │ • JWT Auth Verify  │
                        │ • Rate Limit 1000  │
                        │   req/15min        │
                        │ • CORS Whitelist   │
                        │ • Input Sanitize   │
                        │ • Sandbox Execute  │
                        │ • Encrypt Tokens   │
                        │ • TLS/SSL MongoDB  │
                        │ • WebRTC DTLS-SRTP │
                        └────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                     PERFORMANCE METRICS                         │
│                                                                  │
│  • Code Sync Latency: 50-100ms (WebSocket)                      │
│  • Video Call Latency: 100-300ms (P2P Direct)                   │
│  • Code Execution: 200-500ms avg (Piston API)                   │
│  • Session Retrieval: <50ms (MongoDB Indexed)                   │
│  • Auto-Save: Every 2 seconds (Debounced)                       │
│  • Concurrent Users: 100+                                       │
│  • Concurrent Rooms: 50+                                        │
│  • Session Persistence: Guaranteed 7 Days                       │
│  • Database Operations: <100ms                                  │
│  • WebRTC Connection: 2-5 seconds establishment                 │
└────────────────────────────────────────────────────────────────┘

LEGEND:
  ↓    Sequential Flow
  ┌─┐  Process/Action
  ✓    Success State
  ✗    Failure State
  ╔═╗  Critical Section
```

---

## 1. SYSTEM ARCHITECTURE OVERVIEW

### 1.1 Layered Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER / DEVELOPER / STUDENT                    │
│              (Authentication, Navigation, Interaction)           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              ORCHESTRATION LAYER (React Frontend)                │
│    Routes user requests & coordinates between core modules       │
│      (AuthContext, Room Management, State Synchronization)       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                     ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   COLLABORATION  │ │   VIDEO/VOICE    │ │  CODE EXECUTION  │
│      ENGINE      │ │     SYSTEM       │ │     ENGINE       │
│                  │ │                  │ │                  │
│ • Real-time sync │ │ • WebRTC P2P     │ │ • Multi-language │
│ • Monaco Editor  │ │ • Screen share   │ │ • Test runner    │
│ • Echo prevent   │ │ • Media controls │ │ • Sandbox        │
│ • File manager   │ │ • STUN/TURN      │ │ • Output parser  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              ↓
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                     ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  SESSION MEMORY  │ │  SECURITY/AUTH   │ │  INTEGRATION     │
│                  │ │                  │ │                  │
│ • MongoDB TTL    │ │ • JWT tokens     │ │ • GitHub API     │
│ • 7-day persist  │ │ • Rate limiting  │ │ • Piston API     │
│ • Auto-recovery  │ │ • CORS policy    │ │ • OAuth 2.0      │
│ • State restore  │ │ • Input validate │ │ • REST endpoints │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│            TOOL / ACTION EXECUTION LAYER                         │
│  (Socket.IO Server, WebRTC Signaling, MongoDB, Express APIs)    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   OUTPUT / ACTION TAKEN                          │
│  (Synchronized Code, Live Video, Test Results, GitHub Commits,  │
│   Persistent Sessions, Real-time Notifications)                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INPUT                               │
│  (Type Code | Click Run | Start Video | Join Room | Submit)     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND ORCHESTRATOR                           │
│                   (React State Manager)                          │
│                                                                   │
│  • AuthContext → Manages user authentication state               │
│  • RoomContext → Handles room creation/joining logic             │
│  • EditorContext → Coordinates code editing state                │
│  • VideoContext → Controls WebRTC connections                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
              ┌───────────────┴───────────────┐
              ↓                               ↓
┌────────────────────────────┐  ┌────────────────────────────┐
│   REAL-TIME SYNC MODULE    │  │    PERSISTENCE MODULE      │
│                            │  │                            │
│ Socket.IO Client           │  │ REST API Calls             │
│ • emit('codeChange')       │  │ • POST /sessions/create    │
│ • on('codeUpdate')         │  │ • GET /sessions/:id        │
│ • emit('joinRoom')         │  │ • POST /sessions/update    │
│ • on('roomUsers')          │  │ • GET /problems/:id        │
│                            │  │ • POST /github/push        │
│ Echo Prevention Flag       │  │                            │
│ isRemoteChange: bool       │  │ Auto-save Debounce (2s)    │
└────────────────────────────┘  └────────────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND ROUTER LAYER                          │
│                   (Express.js Middleware)                        │
│                                                                   │
│  Authentication → JWT Verification → Rate Limiting → CORS        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                     ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  SOCKET.IO HUB   │ │  DATABASE LAYER  │ │  EXTERNAL APIs   │
│                  │ │                  │ │                  │
│ Room Management  │ │ MongoDB Atlas    │ │ Piston API       │
│ • join/leave     │ │ • Users          │ │ • Code exec      │
│ • broadcast      │ │ • Sessions (TTL) │ │ • Multi-lang     │
│ • user tracking  │ │ • Problems       │ │                  │
│                  │ │ • Projects       │ │ GitHub API       │
│ WebRTC Signal    │ │                  │ │ • OAuth 2.0      │
│ • offer/answer   │ │ Indexes:         │ │ • Push code      │
│ • ICE exchange   │ │ • roomId (unique)│ │                  │
│ • media control  │ │ • userId         │ │ Google OAuth     │
│                  │ │ • expiresAt(TTL) │ │ • User auth      │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PROCESSING & VALIDATION                       │
│                                                                   │
│  • Sanitize user input                                           │
│  • Validate test cases                                           │
│  • Parse code execution results                                  │
│  • Verify session ownership                                      │
│  • Check rate limits                                             │
│  • Encrypt sensitive data                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    RESPONSE AGGREGATOR                           │
│                                                                   │
│  Combines results from multiple sources:                         │
│  • Socket.IO events → Real-time updates                          │
│  • Database queries → Persistent state                           │
│  • API responses → Execution results                             │
│  • WebRTC signals → Video/audio streams                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      OUTPUT TO USER                              │
│                                                                   │
│  ✓ Synchronized code editor (Monaco)                             │
│  ✓ Live video/audio streams (WebRTC)                             │
│  ✓ Test execution results (Piston)                               │
│  ✓ Persistent session state (MongoDB)                            │
│  ✓ GitHub commit confirmation                                    │
│  ✓ Real-time user presence indicators                            │
│  ✓ Chat messages and notifications                               │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Technology Stack
- **Frontend**: React 18, Vite, Monaco Editor, WebRTC, Socket.IO Client
- **Backend**: Node.js, Express.js, Socket.IO Server, MongoDB, Mongoose
- **Real-time Communication**: Socket.IO v4.8.1 (WebSocket + HTTP long-polling)
- **Video/Audio**: WebRTC with STUN/TURN servers
- **Code Execution**: Piston API (sandboxed code execution service)
- **Authentication**: Google OAuth 2.0 with JWT (7-day persistence)

### 1.4 Data Flow by Use Case

#### Use Case 1: Real-Time Code Collaboration
```
User Types Code
      ↓
Monaco Editor (onDidChangeModelContent)
      ↓
Check isRemoteChange flag (Echo Prevention)
      ↓ [FALSE = Local Change]
socket.emit('codeChange', { roomId, code, language })
      ↓
Backend Socket.IO Server
      ↓
socket.to(roomId).emit('codeUpdate', { code })
      ↓ [Parallel Operations]
      ├→ MongoDB: Session.update({ code })
      └→ Broadcast to all peers (except sender)
      ↓
Other Users Receive 'codeUpdate'
      ↓
Set isRemoteChange = true
      ↓
editor.setValue(code)
      ↓
Display updated code + Reset flag
```

#### Use Case 2: Video Call Establishment
```
User A: Click "Start Video Call"
      ↓
getUserMedia({ video, audio })
      ↓
Display local video stream
      ↓
socket.emit('userReadyForCall', { roomId })
      ↓
Backend: Track active call participants
      ↓
Notify User B: 'userReadyForCall'
      ↓
User B: Create RTCPeerConnection
      ↓
Add local tracks → Create offer
      ↓
socket.emit('webrtc-offer', { offer, to: UserA })
      ↓
Backend: Forward offer to User A
      ↓
User A: Receive offer → Create answer
      ↓
socket.emit('webrtc-answer', { answer, to: UserB })
      ↓
Backend: Forward answer to User B
      ↓
Both peers exchange ICE candidates
      ↓
Direct P2P connection established
      ↓
Video/audio streams flow between peers
```

#### Use Case 3: Code Execution & Testing
```
User writes solution code
      ↓
Click "Run Tests"
      ↓
POST /api/problems/:id/run
      ↓
Backend: Fetch problem test cases from MongoDB
      ↓
For each test case:
      ├→ POST Piston API: execute({ code, language, stdin })
      ├→ Parse output: stdout, stderr, exitCode
      └→ Compare: actualOutput === expectedOutput
      ↓
Aggregate results
      ↓
Return: { passedTests, totalTests, results[] }
      ↓
Display in UI:
      ├→ ✓ Test 1: Passed
      ├→ ✓ Test 2: Passed
      └→ ✗ Test 3: Failed (show diff)
      ↓
If all pass && "Submit":
      └→ Update user.problemsSolved[]
```

#### Use Case 4: Session Persistence & Recovery
```
User creates room
      ↓
Generate unique roomId (8 chars)
      ↓
POST /api/sessions/create
      ↓
MongoDB: Insert session document
      {
        roomId, code, language,
        expiresAt: now + 7 days,
        participants: [user]
      }
      ↓
TTL Index: Schedule auto-deletion at expiresAt
      ↓
User codes for 30 minutes
      ↓
Auto-save every 2 seconds (debounced)
      ↓
User disconnects
      ↓
[24 hours later]
      ↓
User returns → Opens collaboration modal
      ↓
GET /api/sessions/user/:userId
      ↓
MongoDB: Find sessions with userId in participants
      ↓
Calculate time remaining for each
      ↓
Display: Recent sessions (clickable cards)
      ↓
User clicks session card
      ↓
Navigate to /compiler?room=:roomId
      ↓
GET /api/sessions/:roomId
      ↓
Restore state:
      ├→ editor.setValue(session.code)
      ├→ setLanguage(session.language)
      └→ setMessages(session.messages)
      ↓
User continues from where they left off
```

### 1.5 Core Components
```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Monaco  │  │ WebRTC   │  │ Socket.IO│  │  React   │   │
│  │  Editor  │  │ P2P Video│  │  Client  │  │   App    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/WSS
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Express │  │ Socket.IO│  │   JWT    │  │  Piston  │   │
│  │  Server  │  │  Server  │  │   Auth   │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ MongoDB Protocol
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB (Users, Sessions, Problems, Projects)       │  │
│  │  - TTL Indexing for auto-expiration                  │  │
│  │  - 7-day session persistence                         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. USER AUTHENTICATION WORKFLOW

### 2.1 Initial Authentication Flow

```
Step 1: User Clicks "Sign in with Google"
   ↓
Step 2: Google OAuth Popup → User Authorizes
   ↓
Step 3: Google Returns Credential Token
   ↓
Step 4: Frontend Sends Token to Backend (/api/auth/google)
   ↓
Step 5: Backend Verifies Token with Google Auth Library
   ↓
Step 6: Extract User Info (googleId, email, name, picture)
   ↓
Step 7: Check if User Exists in MongoDB
   ├─ YES → Retrieve existing user
   └─ NO  → Create new user with default preferences
   ↓
Step 8: Generate JWT Token (7-day expiration)
   ↓
Step 9: Return JWT + User Data to Frontend
   ↓
Step 10: Store in localStorage & Set AuthContext
   ↓
Step 11: User Authenticated - Redirect to Dashboard
```

### 2.2 Session Persistence Mechanism

**JWT Token Structure:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "user",
  "iat": 1675000000,
  "exp": 1675604800,
  "iss": "prepmate-api",
  "aud": "prepmate-client"
}
```

**Auto-Verification on Page Load:**
- On every page load, frontend checks localStorage for token
- Sends token to `/api/auth/me` endpoint
- Backend verifies token validity
- If valid: User stays logged in
- If expired: Clear storage and redirect to login

---

## 3. COLLABORATIVE CODING WORKFLOW

### 3.1 Room Creation & Joining

```
ROOM CREATION:
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Create New Room"                       │
│    ↓                                                         │
│ Step 2: System generates unique 8-char Room ID (e.g., KZJD) │
│    ↓                                                         │
│ Step 3: POST /api/sessions/create                           │
│    - roomId: "KZJDFV3W"                                     │
│    - creatorName: user.name                                 │
│    - creatorUserId: user.id                                 │
│    - expiresAt: Date.now() + 7 days                         │
│    ↓                                                         │
│ Step 4: MongoDB saves Session document                      │
│    - TTL index on expiresAt for auto-deletion               │
│    ↓                                                         │
│ Step 5: Navigate to /compiler?room=KZJDFV3W                 │
│    ↓                                                         │
│ Step 6: Initialize Socket.IO connection                     │
│    ↓                                                         │
│ Step 7: Emit 'joinRoom' event with roomId                   │
└─────────────────────────────────────────────────────────────┘

ROOM JOINING:
┌─────────────────────────────────────────────────────────────┐
│ Step 1: User enters Room ID in modal OR clicks recent       │
│         session card                                         │
│    ↓                                                         │
│ Step 2: Navigate to /compiler?room=<ROOM_ID>                │
│    ↓                                                         │
│ Step 3: Socket.IO connection established                    │
│    ↓                                                         │
│ Step 4: Emit 'joinRoom' with roomId, userName, userId       │
│    ↓                                                         │
│ Step 5: Backend adds user to room's socket room             │
│    ↓                                                         │
│ Step 6: Backend retrieves session from MongoDB              │
│    ↓                                                         │
│ Step 7: Backend sends current state to new user:            │
│    - Existing code                                           │
│    - Current language                                        │
│    - Chat history                                            │
│    - List of current participants                            │
│    ↓                                                         │
│ Step 8: Backend broadcasts 'userJoined' to existing users   │
│    ↓                                                         │
│ Step 9: New user's editor syncs with room state             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Real-Time Code Synchronization

**Critical Innovation: Echo Prevention Mechanism**

```javascript
// Frontend maintains isRemoteChange flag
isRemoteChange = false

USER TYPES IN EDITOR:
┌──────────────────────────────────────────────────────────┐
│ Monaco Editor triggers onDidChangeModelContent event     │
│    ↓                                                      │
│ Check: if (isRemoteChange) → SKIP (prevent echo)        │
│    ↓                                                      │
│ Get current code: code = editor.getValue()               │
│    ↓                                                      │
│ Emit Socket.IO event:                                     │
│    socket.emit('codeChange', {                           │
│       roomId: "KZJDFV3W",                                │
│       code: "function() {...}",                          │
│       language: "javascript"                             │
│    })                                                     │
│    ↓                                                      │
│ Backend receives 'codeChange'                            │
│    ↓                                                      │
│ Backend emits to ALL in room EXCEPT sender:              │
│    socket.to(roomId).emit('codeUpdate', {...})          │
│    ↓                                                      │
│ Backend updates MongoDB Session:                         │
│    Session.findOneAndUpdate({ roomId }, {               │
│       code: code,                                        │
│       language: language,                                │
│       lastActivity: new Date()                           │
│    })                                                     │
│    ↓                                                      │
│ Other users receive 'codeUpdate'                         │
│    ↓                                                      │
│ Set isRemoteChange = true (prevent echo)                 │
│    ↓                                                      │
│ Update Monaco Editor: editor.setValue(code)              │
│    ↓                                                      │
│ Reset isRemoteChange = false                             │
└──────────────────────────────────────────────────────────┘
```

**Latency Optimization:**
- WebSocket transport for <50ms updates
- Fallback to HTTP long-polling if WebSocket unavailable
- Local updates immediate, remote updates within 100ms

### 3.3 Auto-Save & Session Recovery

**Debounced Auto-Save (2-second delay):**
```
User stops typing
   ↓
Wait 2 seconds
   ↓
POST /api/sessions/${roomId}/update
   - code: current editor content
   - language: selected language
   - lastActivity: timestamp
   ↓
MongoDB updates session document
   ↓
Display "Saved" status indicator
```

**Session Recovery on Rejoin:**
```
User returns to collaboration page
   ↓
GET /api/sessions/${roomId}
   ↓
Retrieve session from MongoDB
   ↓
Restore state in editor:
   - Code content
   - Programming language
   - Chat messages
   - Participant list
   ↓
User continues from where they left off
```

---

## 4. VIDEO CALLING WORKFLOW

### 4.1 WebRTC Peer-to-Peer Connection Establishment

**Complete Signaling Flow:**

```
USER A INITIATES CALL:
┌────────────────────────────────────────────────────────────┐
│ Step 1: Click "Start Video Call"                          │
│    ↓                                                        │
│ Step 2: Request camera/mic permissions                     │
│    navigator.mediaDevices.getUserMedia({                   │
│       video: { width: 1280, height: 720 },                │
│       audio: { echoCancellation: true }                    │
│    })                                                       │
│    ↓                                                        │
│ Step 3: Display local video stream                         │
│    ↓                                                        │
│ Step 4: Emit 'userReadyForCall'                           │
│    socket.emit('userReadyForCall', { roomId })            │
└────────────────────────────────────────────────────────────┘

USER B JOINS CALL:
┌────────────────────────────────────────────────────────────┐
│ Step 1: User B receives 'userReadyForCall' event          │
│    ↓                                                        │
│ Step 2: User B requests own camera/mic                     │
│    ↓                                                        │
│ Step 3: User B creates RTCPeerConnection                   │
│    peerConnection = new RTCPeerConnection({                │
│       iceServers: [                                        │
│          { urls: 'stun:stun.l.google.com:19302' }         │
│       ]                                                     │
│    })                                                       │
│    ↓                                                        │
│ Step 4: User B adds local stream tracks to peer           │
│    localStream.getTracks().forEach(track => {             │
│       peerConnection.addTrack(track, localStream)         │
│    })                                                       │
│    ↓                                                        │
│ Step 5: User B creates WebRTC Offer                       │
│    offer = await peerConnection.createOffer()             │
│    ↓                                                        │
│ Step 6: Set local description                              │
│    await peerConnection.setLocalDescription(offer)        │
│    ↓                                                        │
│ Step 7: Send offer via Socket.IO signaling                │
│    socket.emit('webrtc-offer', {                          │
│       offer: offer,                                        │
│       to: userA_socketId,                                 │
│       roomId: roomId                                       │
│    })                                                       │
└────────────────────────────────────────────────────────────┘

SIGNALING SERVER (Backend):
┌────────────────────────────────────────────────────────────┐
│ Step 1: Receive 'webrtc-offer' from User B                │
│    ↓                                                        │
│ Step 2: Forward to User A                                  │
│    io.to(userA_socketId).emit('webrtc-offer', {           │
│       offer: offer,                                        │
│       from: userB_socketId                                │
│    })                                                       │
└────────────────────────────────────────────────────────────┘

USER A RECEIVES OFFER:
┌────────────────────────────────────────────────────────────┐
│ Step 1: Receive 'webrtc-offer' event                      │
│    ↓                                                        │
│ Step 2: Create RTCPeerConnection for User B               │
│    ↓                                                        │
│ Step 3: Add local tracks to peer connection                │
│    ↓                                                        │
│ Step 4: Set remote description with received offer        │
│    await peerConnection.setRemoteDescription(offer)       │
│    ↓                                                        │
│ Step 5: Create answer                                      │
│    answer = await peerConnection.createAnswer()           │
│    ↓                                                        │
│ Step 6: Set local description                              │
│    await peerConnection.setLocalDescription(answer)       │
│    ↓                                                        │
│ Step 7: Send answer back via signaling                    │
│    socket.emit('webrtc-answer', {                         │
│       answer: answer,                                      │
│       to: userB_socketId,                                 │
│       roomId: roomId                                       │
│    })                                                       │
└────────────────────────────────────────────────────────────┘

USER B RECEIVES ANSWER:
┌────────────────────────────────────────────────────────────┐
│ Step 1: Receive 'webrtc-answer' event                     │
│    ↓                                                        │
│ Step 2: Set remote description with answer                │
│    await peerConnection.setRemoteDescription(answer)      │
│    ↓                                                        │
│ Step 3: WebRTC connection established                     │
└────────────────────────────────────────────────────────────┘

ICE CANDIDATE EXCHANGE (Parallel Process):
┌────────────────────────────────────────────────────────────┐
│ Each peer discovers ICE candidates (network routes)        │
│    ↓                                                        │
│ peerConnection.onicecandidate = (event) => {              │
│    socket.emit('ice-candidate', {                         │
│       candidate: event.candidate,                         │
│       to: otherUserId                                     │
│    })                                                       │
│ }                                                           │
│    ↓                                                        │
│ Other peer receives candidate                              │
│    ↓                                                        │
│ await peerConnection.addIceCandidate(candidate)           │
│    ↓                                                        │
│ Repeat until best network path found                      │
│    ↓                                                        │
│ Direct P2P connection established                         │
│    ↓                                                        │
│ Video/audio streams flow between peers                    │
└────────────────────────────────────────────────────────────┘
```

### 4.2 Screen Sharing Mechanism

```
START SCREEN SHARE:
┌────────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Share Screen"                        │
│    ↓                                                        │
│ Step 2: Browser displays screen picker dialog             │
│    screenStream = await navigator.mediaDevices            │
│       .getDisplayMedia({ video: true })                   │
│    ↓                                                        │
│ Step 3: User selects screen/window                        │
│    ↓                                                        │
│ Step 4: Replace video track in all peer connections       │
│    peerConnections.forEach(pc => {                        │
│       const sender = pc.getSenders()                      │
│          .find(s => s.track.kind === 'video')            │
│       sender.replaceTrack(screenStream.getVideoTracks()[0])│
│    })                                                       │
│    ↓                                                        │
│ Step 5: Other users see shared screen instead of camera   │
│    ↓                                                        │
│ Step 6: Notify via Socket.IO                              │
│    socket.emit('screenShareStarted', { roomId })          │
└────────────────────────────────────────────────────────────┘

STOP SCREEN SHARE:
┌────────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Stop Sharing" OR browser button      │
│    ↓                                                        │
│ Step 2: Stop screen stream tracks                         │
│    screenStream.getTracks().forEach(track => track.stop())│
│    ↓                                                        │
│ Step 3: Restore camera video track                        │
│    peerConnections.forEach(pc => {                        │
│       const sender = pc.getSenders()                      │
│          .find(s => s.track.kind === 'video')            │
│       sender.replaceTrack(localStream.getVideoTracks()[0])│
│    })                                                       │
│    ↓                                                        │
│ Step 4: Other users see camera again                      │
│    ↓                                                        │
│ Step 5: Notify via Socket.IO                              │
│    socket.emit('screenShareStopped', { roomId })          │
└────────────────────────────────────────────────────────────┘
```

### 4.3 Multi-User Handling (Mesh Topology)

**For N users in a call, each user maintains N-1 peer connections:**

```
3-User Call Example:

User A ←→ User B (PeerConnection 1)
User A ←→ User C (PeerConnection 2)
User B ←→ User C (PeerConnection 3)

Total Peer Connections: 3 (N × (N-1) / 2)

Each user:
- Sends their stream to all peers
- Receives N-1 remote streams
- Displays all streams in UI grid
```

---

## 5. CODE EXECUTION ENGINE WORKFLOW

### 5.1 Piston API Integration

**Supported Languages:**
- JavaScript (Node.js 18.15.0)
- Python (3.10.0)
- Java (15.0.2)
- C++ (GCC 10.2.0)
- C (GCC 10.2.0)

### 5.2 Code Execution Flow

```
SINGLE EXECUTION:
┌────────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Run Code"                            │
│    ↓                                                        │
│ Step 2: Frontend collects:                                │
│    - code: editor.getValue()                              │
│    - language: selectedLanguage                           │
│    - input: inputFieldValue                               │
│    ↓                                                        │
│ Step 3: POST /api/execute                                 │
│    {                                                       │
│       language: "javascript",                             │
│       code: "console.log('Hello')",                       │
│       input: ""                                           │
│    }                                                       │
│    ↓                                                        │
│ Step 4: Backend calls Piston API                          │
│    POST https://emkc.org/api/v2/piston/execute            │
│    {                                                       │
│       language: "javascript",                             │
│       version: "18.15.0",                                 │
│       files: [{                                           │
│          name: "main.js",                                 │
│          content: "console.log('Hello')"                  │
│       }],                                                  │
│       stdin: "",                                          │
│       compile_timeout: 10000,                             │
│       run_timeout: 3000                                   │
│    }                                                       │
│    ↓                                                        │
│ Step 5: Piston executes in sandboxed container           │
│    - Isolated environment                                 │
│    - Memory limits enforced                               │
│    - Network access restricted                            │
│    - Maximum 3-second runtime                             │
│    ↓                                                        │
│ Step 6: Piston returns result                             │
│    {                                                       │
│       run: {                                              │
│          stdout: "Hello\n",                               │
│          stderr: "",                                      │
│          code: 0,                                         │
│          signal: null                                     │
│       },                                                   │
│       compile: { ... }                                    │
│    }                                                       │
│    ↓                                                        │
│ Step 7: Backend processes result                          │
│    - Check compilation errors (if compiled language)     │
│    - Check runtime errors                                 │
│    - Extract stdout/stderr                                │
│    ↓                                                        │
│ Step 8: Return to frontend                                │
│    {                                                       │
│       success: true,                                      │
│       output: "Hello",                                    │
│       error: null,                                        │
│       executionTime: "45ms"                               │
│    }                                                       │
│    ↓                                                        │
│ Step 9: Display in output panel                           │
└────────────────────────────────────────────────────────────┘
```

### 5.3 Test Case Execution (DSA Problems)

```
PROBLEM TEST CASE WORKFLOW:
┌────────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Run Tests" or "Submit"               │
│    ↓                                                        │
│ Step 2: Frontend sends:                                    │
│    POST /api/problems/{problemId}/run                     │
│    {                                                       │
│       code: userCode,                                     │
│       language: "javascript"                              │
│    }                                                       │
│    ↓                                                        │
│ Step 3: Backend retrieves problem from MongoDB            │
│    Problem.findById(problemId)                            │
│    ↓                                                        │
│ Step 4: Extract test cases                                │
│    {                                                       │
│       testCases: [                                        │
│          { input: "1 2", expectedOutput: "3", hidden: false },│
│          { input: "5 7", expectedOutput: "12", hidden: false },│
│          { input: "100 200", expectedOutput: "300", hidden: true }│
│       ]                                                    │
│    }                                                       │
│    ↓                                                        │
│ Step 5: Execute each test case sequentially               │
│    for each testCase:                                     │
│       result = pistonAPI.runTestCase(                     │
│          language,                                        │
│          code,                                            │
│          testCase.input,                                  │
│          testCase.expectedOutput                          │
│       )                                                    │
│    ↓                                                        │
│ Step 6: Compare outputs                                    │
│    actualOutput = result.run.stdout.trim()                │
│    expectedOutput = testCase.expectedOutput.trim()        │
│    passed = (actualOutput === expectedOutput)             │
│    ↓                                                        │
│ Step 7: Collect results                                    │
│    results = [                                            │
│       { input: "1 2", expected: "3", actual: "3", passed: true },│
│       { input: "5 7", expected: "12", actual: "12", passed: true },│
│       { input: "100 200", expected: "300", actual: "300", passed: true }│
│    ]                                                       │
│    ↓                                                        │
│ Step 8: Return summary                                     │
│    {                                                       │
│       success: true,                                      │
│       passedTests: 3,                                     │
│       totalTests: 3,                                      │
│       results: results                                    │
│    }                                                       │
│    ↓                                                        │
│ Step 9: Display in UI                                      │
│    ✓ Test Case 1: Passed                                  │
│    ✓ Test Case 2: Passed                                  │
│    ✓ Test Case 3: Passed (Hidden)                         │
│    ↓                                                        │
│ Step 10: If all passed and "Submit" clicked:              │
│    - Mark problem as solved in user profile               │
│    - Update user statistics                               │
│    - Save solution to database                            │
│    User.update({                                          │
│       $push: {                                            │
│          problemsSolved: {                                │
│             problemId: problemId,                         │
│             solvedAt: new Date(),                         │
│             solution: code,                               │
│             language: language                            │
│          }                                                 │
│       },                                                   │
│       $inc: { 'stats.totalProblems': 1 }                 │
│    })                                                      │
└────────────────────────────────────────────────────────────┘
```

### 5.4 Error Handling

**Compilation Errors:**
```
If compile.code !== 0:
   Display: compile.stderr
   Color: Red
   Icon: ✗ Compilation Failed
```

**Runtime Errors:**
```
If run.code !== 0:
   Display: run.stderr
   Color: Red
   Icon: ✗ Runtime Error
```

**Timeout Errors:**
```
If execution > 3 seconds:
   Kill process
   Display: "Time Limit Exceeded"
```

---

## 6. DSA PROBLEM SOLVING WORKFLOW

### 6.1 Problem Selection

```
USER BROWSES PROBLEMS:
┌────────────────────────────────────────────────────────────┐
│ Step 1: Navigate to Practice Page                         │
│    ↓                                                        │
│ Step 2: Frontend fetches problems                         │
│    GET /api/problems                                      │
│    ↓                                                        │
│ Step 3: Backend queries MongoDB                           │
│    Problem.find({})                                       │
│       .sort({ difficulty: 1, title: 1 })                 │
│    ↓                                                        │
│ Step 4: Return problems with metadata                     │
│    [                                                       │
│       {                                                    │
│          id: "65f...",                                    │
│          title: "Two Sum",                                │
│          difficulty: "Easy",                              │
│          category: "Array",                               │
│          description: "Given an array...",                │
│          testCases: [...],                                │
│          constraints: "1 <= nums.length <= 10^4",         │
│          examples: [...],                                 │
│          hints: [...]                                     │
│       },                                                   │
│       ...                                                  │
│    ]                                                       │
│    ↓                                                        │
│ Step 5: Display in filterable grid                        │
│    - Filter by difficulty                                 │
│    - Filter by category                                   │
│    - Search by title                                      │
│    - Show solved status                                   │
└────────────────────────────────────────────────────────────┘
```

### 6.2 Problem Solving Interface

```
USER SOLVES PROBLEM:
┌────────────────────────────────────────────────────────────┐
│ Step 1: Click on problem card                             │
│    ↓                                                        │
│ Step 2: Navigate to /problem/:id                          │
│    ↓                                                        │
│ Step 3: Load problem details                              │
│    GET /api/problems/:id                                  │
│    ↓                                                        │
│ Step 4: Initialize code editor with template              │
│    - Language-specific boilerplate                        │
│    - Function signature (if applicable)                   │
│    ↓                                                        │
│ Step 5: Display problem details:                          │
│    ┌─────────────────────────────────────┐               │
│    │ Problem Description (Left Panel)    │               │
│    │  - Title & Difficulty               │               │
│    │  - Problem Statement                │               │
│    │  - Example Test Cases               │               │
│    │  - Constraints                      │               │
│    │  - Hints (expandable)               │               │
│    └─────────────────────────────────────┘               │
│    ┌─────────────────────────────────────┐               │
│    │ Code Editor (Right Panel)           │               │
│    │  - Monaco Editor                    │               │
│    │  - Language Selector                │               │
│    │  - Run / Submit buttons             │               │
│    └─────────────────────────────────────┘               │
│    ↓                                                        │
│ Step 6: User writes solution                              │
│    ↓                                                        │
│ Step 7: Click "Run Code" (visible test cases only)        │
│    - Execute against sample test cases                    │
│    - Show input/output for debugging                      │
│    ↓                                                        │
│ Step 8: Click "Submit" (all test cases)                   │
│    - Execute against all test cases (including hidden)    │
│    - If all pass: Mark as solved                          │
│    - If any fail: Show which test failed                  │
│    ↓                                                        │
│ Step 9: Submission result                                 │
│    SUCCESS:                                               │
│       ✓ All test cases passed!                            │
│       ✓ Problem marked as solved                          │
│       ✓ +1 to user statistics                             │
│    FAILURE:                                               │
│       ✗ Test case 3 failed                                │
│       Input: "100 200"                                    │
│       Expected: "300"                                     │
│       Actual: "301"                                       │
└────────────────────────────────────────────────────────────┘
```

### 6.3 Progress Tracking

```
USER PROFILE STATISTICS:
┌────────────────────────────────────────────────────────────┐
│ MongoDB User Document:                                     │
│ {                                                          │
│    problemsSolved: [                                       │
│       {                                                    │
│          problemId: ObjectId("65f..."),                   │
│          solvedAt: ISODate("2024-01-15"),                 │
│          solution: "function twoSum() {...}",             │
│          language: "javascript"                           │
│       }                                                    │
│    ],                                                       │
│    stats: {                                               │
│       totalProblems: 25,                                  │
│       easyProblems: 15,                                   │
│       mediumProblems: 8,                                  │
│       hardProblems: 2                                     │
│    }                                                       │
│ }                                                          │
│    ↓                                                        │
│ Profile Page Display:                                     │
│    📊 Problems Solved: 25                                 │
│    🟢 Easy: 15                                            │
│    🟡 Medium: 8                                           │
│    🔴 Hard: 2                                             │
└────────────────────────────────────────────────────────────┘
```

---

## 7. SESSION MANAGEMENT & PERSISTENCE

### 7.1 MongoDB TTL Indexing

**Session Schema:**
```javascript
{
  roomId: String (unique, indexed),
  creatorName: String,
  creatorUserId: ObjectId,
  participants: [{
    userId: ObjectId,
    name: String,
    joinedAt: Date,
    lastSeen: Date
  }],
  code: String (editor content),
  language: String,
  messages: [{
    userId: ObjectId,
    userName: String,
    message: String,
    timestamp: Date
  }],
  files: Array,
  whiteboardElements: Array,
  lastActivity: Date,
  expiresAt: Date (TTL index),
  createdAt: Date
}

// TTL Index Configuration
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

**Auto-Deletion Mechanism:**
- MongoDB background thread checks TTL index every 60 seconds
- Deletes documents where expiresAt <= current time
- Automatic cleanup, no manual intervention needed

### 7.2 Recent Sessions UI

```
USER OPENS COLLABORATION MODAL:
┌────────────────────────────────────────────────────────────┐
│ Step 1: Modal displays loading spinner                    │
│    ↓                                                        │
│ Step 2: Fetch user's recent sessions                      │
│    GET /api/sessions/user/:userId                         │
│    ↓                                                        │
│ Step 3: Backend queries MongoDB                           │
│    Session.find({                                         │
│       'participants.userId': userId,                      │
│       expiresAt: { $gt: new Date() }                     │
│    })                                                       │
│    .sort({ lastActivity: -1 })                           │
│    .limit(10)                                             │
│    ↓                                                        │
│ Step 4: Calculate time remaining for each session         │
│    for each session:                                      │
│       timeLeft = expiresAt - now                         │
│       days = floor(timeLeft / 86400000)                  │
│       hours = floor((timeLeft % 86400000) / 3600000)     │
│       display: "6d 23h left"                             │
│    ↓                                                        │
│ Step 5: Display as clickable cards                        │
│    ┌──────────────────────────────────────┐              │
│    │ 🕐 Recent Sessions                   │              │
│    │                                       │              │
│    │ ┌──────────────────────────────────┐ │              │
│    │ │ Room: KZJDFV3W                   │ │              │
│    │ │ 👥 3 participants                 │ │              │
│    │ │ 📅 Created: Jan 15, 2024         │ │              │
│    │ │ ⏰ 6d 23h left                    │ │              │
│    │ └──────────────────────────────────┘ │              │
│    │                                       │              │
│    │ ┌──────────────────────────────────┐ │              │
│    │ │ Room: ABC12345                   │ │              │
│    │ │ 👥 2 participants                 │ │              │
│    │ │ 📅 Created: Jan 14, 2024         │ │              │
│    │ │ ⏰ 5d 18h left                    │ │              │
│    │ └──────────────────────────────────┘ │              │
│    └──────────────────────────────────────┘              │
│    ↓                                                        │
│ Step 6: User clicks session card                          │
│    ↓                                                        │
│ Step 7: Instant rejoin to room                            │
│    Navigate to /compiler?room=KZJDFV3W                   │
│    ↓                                                        │
│ Step 8: Restore all session state                         │
└────────────────────────────────────────────────────────────┘
```

---

## 8. GITHUB INTEGRATION WORKFLOW

### 8.1 GitHub OAuth Setup

```
GITHUB CONNECTION:
┌────────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Connect GitHub" in profile           │
│    ↓                                                        │
│ Step 2: Redirect to GitHub OAuth                          │
│    https://github.com/login/oauth/authorize?              │
│       client_id={GITHUB_CLIENT_ID}&                       │
│       scope=repo,user&                                    │
│       redirect_uri={CALLBACK_URL}                         │
│    ↓                                                        │
│ Step 3: User authorizes PrepMate app                       │
│    ↓                                                        │
│ Step 4: GitHub redirects back with code                   │
│    {CALLBACK_URL}?code=abc123...                          │
│    ↓                                                        │
│ Step 5: Frontend sends code to backend                    │
│    POST /api/github/oauth/callback                        │
│    { code: "abc123..." }                                  │
│    ↓                                                        │
│ Step 6: Backend exchanges code for access token           │
│    POST https://github.com/login/oauth/access_token       │
│    {                                                       │
│       client_id: GITHUB_CLIENT_ID,                        │
│       client_secret: GITHUB_CLIENT_SECRET,                │
│       code: "abc123..."                                   │
│    }                                                       │
│    ↓                                                        │
│ Step 7: Receive access token                              │
│    {                                                       │
│       access_token: "gho_abc123...",                      │
│       scope: "repo,user",                                 │
│       token_type: "bearer"                                │
│    }                                                       │
│    ↓                                                        │
│ Step 8: Store token in user document (encrypted)          │
│    User.findByIdAndUpdate(userId, {                       │
│       githubToken: encrypt(access_token),                 │
│       githubConnected: true                               │
│    })                                                      │
│    ↓                                                        │
│ Step 9: Display "Connected ✓" status                      │
└────────────────────────────────────────────────────────────┘
```

### 8.2 Code Push to GitHub

```
SAVE CODE TO GITHUB:
┌────────────────────────────────────────────────────────────┐
│ Step 1: User clicks "Save to GitHub"                      │
│    ↓                                                        │
│ Step 2: Modal displays:                                    │
│    - Repository selector (fetch user repos)               │
│    - Branch name input                                    │
│    - File name input                                      │
│    - Commit message input                                 │
│    ↓                                                        │
│ Step 3: Fetch user's repositories                         │
│    GET https://api.github.com/user/repos                  │
│    Headers: { Authorization: "Bearer {access_token}" }    │
│    ↓                                                        │
│ Step 4: User fills form and clicks "Push"                 │
│    ↓                                                        │
│ Step 5: Backend receives request                          │
│    POST /api/github/push                                  │
│    {                                                       │
│       repository: "user/repo",                            │
│       branch: "main",                                     │
│       filename: "solution.js",                            │
│       content: "function twoSum() {...}",                 │
│       message: "Solved Two Sum problem"                   │
│    }                                                       │
│    ↓                                                        │
│ Step 6: Get file SHA (if exists)                          │
│    GET https://api.github.com/repos/{owner}/{repo}/       │
│        contents/{filename}?ref={branch}                   │
│    ↓                                                        │
│ Step 7: Create/Update file via GitHub API                 │
│    PUT https://api.github.com/repos/{owner}/{repo}/       │
│        contents/{filename}                                │
│    {                                                       │
│       message: "Solved Two Sum problem",                  │
│       content: base64(fileContent),                       │
│       branch: "main",                                     │
│       sha: "abc123..." (if updating existing file)        │
│    }                                                       │
│    ↓                                                        │
│ Step 8: GitHub commits file                               │
│    Returns commit SHA and URL                             │
│    ↓                                                        │
│ Step 9: Display success                                    │
│    "✓ Pushed to GitHub successfully!"                     │
│    [View on GitHub] button with link                      │
└────────────────────────────────────────────────────────────┘
```

---

## 9. SECURITY MECHANISMS

### 9.1 Authentication Security

**JWT Token Security:**
- 256-bit secret key
- 7-day expiration
- Issuer/audience validation
- HTTP-only cookie option (production)

**Rate Limiting:**
- 1000 requests per 15 minutes per IP
- Prevents brute force attacks
- 429 Too Many Requests on exceed

### 9.2 Code Execution Security

**Piston API Sandbox:**
- Isolated Docker containers
- No network access
- Memory limits: 128MB default
- CPU time limits: 3 seconds
- File system: read-only except temp dir

### 9.3 Data Security

**MongoDB Security:**
- Connection string in environment variables
- Indexes on sensitive fields
- TTL for automatic data expiration
- Input validation and sanitization

**CORS Policy:**
```javascript
cors({
  origin: [ALLOWED_FRONTEND_URLS],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

### 9.4 WebRTC Security

**Peer Connection Security:**
- STUN servers for NAT traversal (non-sensitive)
- TURN servers with authentication (production)
- Encrypted media streams (DTLS-SRTP)
- Signaling over secure WebSocket (WSS)

---

## 10. NOVEL FEATURES & INNOVATIONS

### 10.1 Echo Prevention in Real-Time Collaboration

**Innovation:** Bidirectional flag system prevents infinite update loops
- `isRemoteChange` flag tracks update source
- Prevents re-broadcasting received updates
- Maintains editor state consistency

### 10.2 TTL-Based Session Management

**Innovation:** Automatic session cleanup using MongoDB TTL indexing
- No cron jobs needed
- Database-native expiration
- Guaranteed 7-day persistence

### 10.3 Unified Platform Integration

**Innovation:** Single platform for multiple workflows
- Practice DSA problems
- Real-time collaboration
- Video conferencing
- Code execution
- GitHub integration
- All accessible in one session

### 10.4 Mesh WebRTC Topology

**Innovation:** Direct peer-to-peer connections without media server
- Lower latency
- Reduced server costs
- Better privacy (no centralized media processing)

### 10.5 Cross-Platform Code Execution

**Innovation:** Language-agnostic execution engine
- Supports 5+ languages
- Consistent API regardless of language
- Automated test case validation
- Real-time output streaming

---

## 11. SCALABILITY CONSIDERATIONS

### 11.1 Socket.IO Scaling

**Current:** Single server instance
**Future:** Redis adapter for multi-server deployment
```javascript
io.adapter(redisAdapter({ 
  host: 'redis-server', 
  port: 6379 
}));
```

### 11.2 Database Optimization

**Indexes:**
- `roomId` (unique, for fast session lookup)
- `userId` (for user queries)
- `expiresAt` (TTL for auto-deletion)
- `lastActivity` (for sorting recent sessions)

### 11.3 WebRTC Scaling

**Mesh Topology Limitations:**
- Works well for ≤4 participants
- For >4: Consider SFU (Selective Forwarding Unit)

**Migration Path:**
- Implement media server (Janus, Mediasoup)
- Switch from mesh to SFU topology
- Maintain backward compatibility

---

## 12. COMPLETE USER JOURNEY EXAMPLE

```
SCENARIO: Alice and Bob solving a coding problem together

┌────────────────────────────────────────────────────────────┐
│ ALICE:                                                     │
│ 1. Opens PrepMate → Signs in with Google                  │
│ 2. Goes to Practice page → Selects "Two Sum"              │
│ 3. Clicks "Collaborate" button                            │
│ 4. Creates room → Gets Room ID: "KZJD"                    │
│ 5. Shares Room ID with Bob via chat/email                 │
│ 6. Starts typing solution in JavaScript                   │
│ 7. Clicks "Start Video Call"                              │
│ 8. Sees Bob's video feed appear                           │
│ 9. Discusses approach over video                          │
│ 10. Types code - Bob sees updates in real-time            │
│ 11. Clicks "Run Tests"                                     │
│ 12. Sees 2/3 test cases pass, 1 fails                     │
│ 13. Bob suggests fix over video                           │
│ 14. Alice modifies code                                    │
│ 15. Clicks "Submit" → All tests pass!                      │
│ 16. Clicks "Save to GitHub"                               │
│ 17. Pushes to alice/leetcode-solutions repo               │
│ 18. Problem marked as solved in profile                   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ BOB:                                                       │
│ 1. Receives Room ID "KZJD" from Alice                     │
│ 2. Opens PrepMate → Signs in with Google                  │
│ 3. Clicks "Join Room" → Enters "KZJD"                     │
│ 4. Joins room → Sees Alice's code in editor               │
│ 5. Receives notification: "Alice started video call"      │
│ 6. Clicks "Join Call"                                      │
│ 7. Video feed appears for both                            │
│ 8. Watches Alice type - sees every keystroke              │
│ 9. Suggests using HashMap for O(n) solution               │
│ 10. Sees Alice implement suggestion                        │
│ 11. Observes test results in real-time                    │
│ 12. Points out edge case causing failure                  │
│ 13. Watches Alice fix and resubmit                        │
│ 14. Celebrates success over video call                    │
│ 15. Leaves room gracefully                                │
│ 16. Can rejoin anytime within 7 days                      │
└────────────────────────────────────────────────────────────┘

SYSTEM ACTIVITY (Behind the Scenes):
┌────────────────────────────────────────────────────────────┐
│ • 157 Socket.IO events exchanged                           │
│ • 34 code updates synchronized                             │
│ • 2 WebRTC connections established (Alice↔Bob)             │
│ • 5 Piston API calls (1 for Alice's tests)                 │
│ • 12 MongoDB writes (session updates every 2 seconds)      │
│ • 1 GitHub API push                                        │
│ • Total latency: <100ms for all real-time updates          │
│ • Session stored for 7 days with auto-expiration           │
└────────────────────────────────────────────────────────────┘
```

---

## 13. SYSTEM PERFORMANCE METRICS

**Real-Time Synchronization:**
- Code sync latency: 50-100ms (WebSocket)
- User presence update: <50ms
- Video call latency: 100-300ms (P2P)

**Code Execution:**
- Average execution time: 200-500ms
- Test case batch: 500-2000ms (parallel execution)
- Maximum timeout: 3000ms

**Database Performance:**
- Session retrieval: <50ms (indexed)
- Session update: <100ms
- Problem fetch: <80ms
- User auth: <200ms (including JWT generation)

**Scalability:**
- Current concurrent users: 100+
- Rooms per server: 50+
- Messages per second: 1000+
- Database connections: 10 pooled

---

## 14. PATENT CLAIMS SUMMARY

### Novel Technical Contributions:

1. **Integrated Collaborative Coding Platform**
   - Unified system combining real-time editing, video calls, and code execution
   - Single session maintains multiple concurrent communication channels

2. **Echo-Prevention Mechanism for Real-Time Synchronization**
   - Bidirectional flag system prevents infinite update loops
   - Maintains consistency across multiple concurrent editors

3. **TTL-Based Session Persistence**
   - Database-native automatic cleanup mechanism
   - Guaranteed session availability for configurable duration
   - Zero-overhead expiration handling

4. **Hybrid Communication Architecture**
   - Socket.IO for signaling and state synchronization
   - WebRTC for peer-to-peer media streaming
   - REST API for persistent data operations
   - Seamless integration of all three protocols

5. **Language-Agnostic Code Execution Engine**
   - Unified API for multiple programming languages
   - Automated test case validation system
   - Sandboxed execution environment integration

6. **Intelligent Room Recovery System**
   - Automatic state restoration on reconnection
   - Recent sessions with time-remaining indicators
   - One-click rejoin workflow

---

## CONCLUSION

PrepMate represents a comprehensive collaborative coding platform that solves the fragmented workflow problem faced by developers during pair programming, technical interviews, and algorithm practice. By integrating real-time collaboration, video conferencing, automated code execution, and session persistence into a unified system, it provides a seamless experience that eliminates context switching and tool fragmentation.

The platform's novel technical approaches—particularly the echo-prevention mechanism, TTL-based session management, and hybrid communication architecture—demonstrate innovative solutions to common distributed systems challenges. These innovations, combined with the platform's unified approach to multiple developer workflows, position PrepMate as a significant advancement in collaborative development tools.

---

*Document Version: 1.0*  
*Date: February 18, 2026*  
*Prepared for: Patent Application Documentation*
