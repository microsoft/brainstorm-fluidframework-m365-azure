import { useEffect } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as signalR from '@microsoft/signalr';
import { Notification } from './GraphNotifications';

function SignalRConnection() {  

  useEffect(() => {
    //SignalR Connection
    const apiBaseUrl = "https://notifications-function.azurewebsites.net/api";
    const connection = new signalR.HubConnectionBuilder()
          .withUrl(apiBaseUrl)
          .configureLogging(signalR.LogLevel.Information)
          .build();
        connection.start().then(function () {
          console.log("connected");
        }).catch(function (err) {
            return console.error(err.toString());
        });
  
        connection.on('newMessage', (message) => {
          Notification(message);        
        });
  }, []);
  
  return (
    <div className="App">
      <ToastContainer position="bottom-right"
          hideProgressBar={true}
          newestOnTop={true}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          transition={Slide}
          icon={false}
          bodyClassName={() => "text-sm font-white font-med block p-3"}
          style={{border:"#29B702", padding:"1px" , margin:"5px"}}
          
          >
        </ToastContainer>
      
    </div>
  );
}


export default SignalRConnection;