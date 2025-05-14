const UserDetails = () => {
  const userData =
    JSON.parse(localStorage.getItem("userData")) ||
    JSON.parse(sessionStorage.getItem("userData"));

  return (
    <div className="w-full sm:w-1/2 text-center p-4">
      {userData && (
        <div>
          <img
            src={userData.profileImage}
            alt={userData.realName}
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold">{userData.realName}</h2>
          <p className="text-lg text-gray-600">@{userData.username}</p>
          <p className="text-xl font-semibold mt-1">
            Score: {userData.score}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
