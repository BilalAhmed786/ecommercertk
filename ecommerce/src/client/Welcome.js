import Sidebarmenu from './component/Sidebarmenu';

function Welcome({ username }) {
  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />

      <div className="welcome-main">
        <div className="welcome-message">
          <h2>👋 Welcome, <span>{username}</span></h2>
          <p>Glad to see you on your dashboard.</p>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
