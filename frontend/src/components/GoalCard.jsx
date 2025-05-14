import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCheckCircle, faTrophy, faSmile } from "@fortawesome/free-solid-svg-icons";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const GoalCard = ({ goal }) => {
    const isCompleted = goal.status === "completed";
    let progress;
    let currentValue;
    if (isCompleted) {
        currentValue = goal.endValueChallenger;
    }
    else {
        currentValue = goal.currentValueChallenger;
    }



    if (goal.criterion == 'ranking') {
        progress = Math.min(
            ((goal.startValueChallenger - currentValue) /
                (goal.startValueChallenger - goal.targetValueChallenger)) *
            100,
            100
        );
    }
    else {
        progress = Math.min(
            ((currentValue - goal.startValueChallenger) /
                (goal.targetValueChallenger - goal.startValueChallenger)) *
            100,
            100
        );
    }
    const timeRemaining = isCompleted
        ? "Completed"
        : Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24)) + " days left";

    return (
        <motion.div
            className={` rounded-xl shadow-lg w-auto max-w-80`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="bg-blue-500 rounded-t-xl py-4 space-y-2">
           
                    <div className="flex justify-center items-center mb-1">
                        <div style={{ width: "80px", height: "80px" }}>
                            <CircularProgressbar
                                value={progress}
                                text={`${Math.floor(progress)}%`}
                                styles={buildStyles({
                                    textSize: "14px",
                                    pathColor: progress < 50 ? "#f6ad55" : "#68d391",
                                    textColor: "#ffff",
                                    trailColor: "#ffff",
                                })}
                            />
                        </div>
                    </div>
            

                                <div className="text-center">
                    <p className="text-xl font-bold text-gray-50 capitalize">{goal.criterion.replace(/([A-Z])/g, " $1")}</p>
                    {!isCompleted && (
                        <p className="text-white text-sm">Target: {goal.targetValueChallenger.toLocaleString()}</p>
                    )}
                </div>
            </div>

            <div className="bg-white p-4 rounded-b-xl">
                                <div className="mt-4 flex justify-center items-center space-x-2">
                    <FontAwesomeIcon
                        icon={isCompleted ? (goal.result === "won" ? faTrophy : faSmile) : faClock}
                        className={`text-2xl ${isCompleted ? (goal.result === "won" ? "text-yellow-500" : "text-blue-500") : "text-blue-600"
                            }`}
                    />
                    <p className={`text-lg ${isCompleted ? "font-bold text-gray-800" : "text-gray-900"}`}>
                        {isCompleted
                            ? goal.result === "won"
                                ? "You Won! 🎉"
                                : "Better Luck Next Time!"
                            : timeRemaining}
                    </p>
                </div>

                                <div className="mt-4 text-center text-sm text-gray-700 space-y-2 ">
                    {!isCompleted && (
                        <>
                            <p>
                                Progress:{" "}
                                <span className="font-semibold">
                                    {goal.currentValueChallenger - goal.startValueChallenger}
                                </span>{" "}
                                / {goal.targetValueChallenger - goal.startValueChallenger}
                            </p>
                            <p>Started on: {new Date(goal.startDate).toLocaleDateString()}</p>
                        </>
                    )}
                    {isCompleted && (
                        <>
                            <p>Completed on: {new Date(goal.endDate).toLocaleDateString()}</p>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default GoalCard;
