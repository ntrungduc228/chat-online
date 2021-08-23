// const { stubFalse } = require("lodash");

function videoChat(divId) {
    $(`#video-chat_${divId}`).unbind("click").on("click", function() {
        let targetId = $(this).data("chat");
        let callerName = $("#navbar-username").text();
        let dataToEmit = {
            listenerId: targetId,
            callerName: callerName,
        };

        // Step 01 of Caller
        socket.emit("caller-check-listener-online-or-not", dataToEmit); 
    });
}

function playVideoStream(videoTagId, stream) {
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function() {
        video.play();
    };
};

function closeVideoStream(stream) {
    stream.getTracks().forEach(function(track) { track.stop(); });
}

$(document).ready(function () {
    // Step 02 of Caller
    socket.on("server-send-listener-is-offline", function() {
        alertify.notify("Người dùng này hiện không trực tuyến", "error", 7);
    });

    let getPeerId = "";
    // const peer = new Peer({
    //     host: '/',
    //     port: "3000",
    //     path: '/peerjs'
    // });
    const peer = new Peer();
   // console.log(peer); 
    peer.on("open",  function(peerId) {
        getPeerId = peerId;
    }); 
    // Step 03 of Listener
    socket.on("server-request-peer-id-of-listener", function(response) {
        let listenerName = $("#navbar-username").text();
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: listenerName,
            listenerPeerId: getPeerId
        };

        // Step 04 of Listener
        socket.emit("listener-emit-peer-id-to-server", dataToEmit);
    });

    let timerInterval;
    // Step 5 of Caller
    socket.on("server-send-peer-id-of-listener-to-caller", function(response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        };

        // Step 6 of Caller
        socket.emit("caller-request-call-to-server", dataToEmit);

        Swal.fire({
            title: `Đang gọi cho &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html:`
                Thời gian: <strong style="color: #d43f3a;"></strong> giây <br/> <br/>
                <button id="btn-cancel-call" class="btn btn-danger">Hủy</button>
            `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000, // 30 seconds
            onBeforeOpen: () => {
                $("#btn-cancel-call").unbind("click").on("click", function() {
                    Swal.close();
                    clearInterval(timerInterval);

                    // Step 07 of Caller
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit);
                });

                if(Swal.getContent().querySelector !== null) {
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000);
                }
               
            },
            onOpen: () => {
                // Step 12 of Caller
                socket.on("server-send-reject-call-to-caller", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);

                    Swal.fire({
                        type: "info",
                        title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; đang bận`,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận",
                    });
                });
                
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
          }).then((result) => {
            return false;
          });
    });

    // Step 08 of Listener
    socket.on("server-send-request-call-to-listener", function(response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        };

        let timerInterval;
        Swal.fire({
            title: `<span style="color: #2ECC71;">${response.callerName}</span> &nbsp; đang gọi video cho bạn &nbsp; <i class="fa fa-volume-control-phone"></i>`,
            html:`
                Thời gian: <strong style="color: #d43f3a;"></strong> giây <br/> <br/>
                <button id="btn-reject-call" class="btn btn-danger">Từ chối</button>
                <button id="btn-accept-call" class="btn btn-success">Chấp nhận</button>
            `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000, // 30 seconds
            onBeforeOpen: () => {
                $("#btn-reject-call").unbind("click").on("click", function() {
                    Swal.close();
                    clearInterval(timerInterval);

                    // Step 10 of Listener
                    socket.emit("listener-reject-request-call-to-server", dataToEmit);
                });

                $("#btn-accept-call").unbind("click").on("click", function() {
                    Swal.close();
                    clearInterval(timerInterval);

                    // Step 11 of Listener
                    socket.emit("listener-accept-request-call-to-server", dataToEmit);
                });

                //if(Swal.getContent().querySelector !== null) {
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000);
                //}
                
            },
            onOpen: () => {
                // Step 09 of Listener
                socket.on("server-send-cancel-request-call-to-listener", function(response) {
                    Swal.close();
                    clearInterval(timerInterval);

                });
            },
            onClose: () => {
                clearInterval(timerInterval);
            }
          }).then((result) => {
            return false;
          });
    });

    // Step 13 of Caller
    socket.on("server-send-accept-call-to-caller", function(response) {
        Swal.close();
        clearInterval(timerInterval);

        console.log('Caller ok');

        navigator.mediaDevices.getUserMedia({audio: true, video: true})
        .then((stream) => {
            // console.log('Stream', stream);
           // Show modal streaming
           $("#streamModal").modal("show");

           // Play my stream in local (of caller)
           playVideoStream("local-stream", stream);

           // Call to listener
           let call = peer.call(response.listenerPeerId, stream);

           // Listen & play stream of listener
           call.on('stream', function(remoteStream) {
                // Play stream of listener
                playVideoStream("remote-stream", remoteStream);
          });

           // Close modal: remove stream
           $("#streamModal").on("hidden.bs.modal", function() {
                closeVideoStream(stream);
                Swal.fire({
                    type: "info",
                    title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color:#2ECC71;"> ${response.listenerName}</span>`,
                    backdrop: "rgba(85, 85, 85, 0.4)",
                    width: "52rem",
                    allowOutsideClick: false,
                    confirmButtonColor: "#2ECC71",
                    confirmButtonText: "Xác nhận"
                });
            });

        })
        .catch(function(err) {
            console.log('Failed to get local stream: ' ,err);
            if(err.toString().includes("Permission denied")) { console.log('Permission denied');
                alertify.notify("Xin lỗi, bạn đã tắt quyền truy cập nghe gọi vào thiết bị trên trình duyệt, vui lòng mở lại trong phần cài đặt của trình duyệt.", "error", 7);
            }
            if(err.toString().includes("NotFoundError: Requested devide not found")) {
                alertify.notify("Xin lỗi, chúng tôi không tìm thấy bộ phận hỗ trợ nghe gọi trên thiết bị nghe gọi của bạn. ", "error", 7);
            }
        })
        
    });

    // Step 14 of Listener
    socket.on("server-send-accept-call-to-listener", function(response) {
        Swal.close();
        clearInterval(timerInterval);

        console.log('Listener ok');

        peer.on('call', function(call) {
            navigator.mediaDevices.getUserMedia({audio: true, video: true})
             .then((stream) => {
                 // Show modal streaming
                 $("#streamModal").modal("show");
                
                 // Play my stream in local (of listener)
                playVideoStream("local-stream", stream);

                call.answer(stream); // Answer the call with an A/V stream.
                call.on('stream', function(remoteStream) {
                    // Play stream of caller
                    playVideoStream("remote-stream", remoteStream);
                });

                // Close modal: remove stream
                $("#streamModal").on("hidden.bs.modal", function() {
                    closeVideoStream(stream);
                    Swal.fire({
                        type: "info",
                        title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color:#2ECC71;"> ${response.callerName}</span>`,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: "#2ECC71",
                        confirmButtonText: "Xác nhận"
                    });
                });
             })
             .catch(function(err) {
                console.log('Failed to get local stream: ' ,err);
                if(err.toString().includes("Permission denied")) {
                    alertify.notify("Xin lỗi, bạn đã tắt quyền truy cập nghe gọi vào thiết bị trên trình duyệt, vui lòng mở lại trong phần cài đặt của trình duyệt.", "error", 7);
                }
                if(err.toString().includes("DOMException: Requested devide not found")) {
                    alertify.notify("Xin lỗi, chúng tôi không tìm thấy bộ phận hỗ trợ nghe gọi trên thiết bị nghe gọi của bạn. ", "error", 7);
                }
            });
        }, (err) => {
            console.log('Failed to get local stream: ' ,err);
            
        });
    });
});