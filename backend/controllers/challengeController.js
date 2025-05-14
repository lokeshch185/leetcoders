import { Challenge, SelfChallenge } from '../models/Challenge.js';
import User from '../models/User.js'; 

// 'ranking', 'problemCount', 'contestRating', 'totalActiveDays'
const createChallenge = async (req, res) => {
  const { challengerUsername, opponentUsername, criterion, endDate } = req.body;
  // console.log(criterion)

  try {
    const challenger = await User.findOne({ username: challengerUsername }).select('_id ' + criterion);
    const opponent = await User.findOne({ username: opponentUsername }).select('_id ' + criterion);
    // console.log(challenger,opponent)

    if (!challenger || !opponent) {
      return res.status(404).json({ error: 'Challenger or opponent not found' });
    }

    const startValueChallenger = challenger[criterion];
    const startValueOpponent = opponent[criterion];
    
    const newChallenge = new Challenge({
      challenger: challenger._id,
      opponent: opponent._id,
      criterion,
      startValueChallenger,
      startValueOpponent,
      endDate
    });

    await newChallenge.save();
    res.status(201).json({ message: 'Challenge created successfully', challenge: newChallenge });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ error: 'Failed to create challenge' });
  }
};

const createSelfChallenge = async (req, res) => {
    const { criterion, targetValueChallenger, endDate } = req.body;
    const { id } = req.userid;
  
    try {
      const challenger = await User.findById(id).select(criterion);
  
      if (!challenger) {
        return res.status(404).json({ error: 'Challenger not found' });
      }
  
      const startValueChallenger = challenger[criterion];
      
      const newChallenge = new SelfChallenge({
        challenger: id,
        criterion,
        startValueChallenger,
        targetValueChallenger,
        endDate
      });
  
      await newChallenge.save();
      res.status(201).json({ message: 'Self Challenge created successfully', selfChallenge: newChallenge });
    } catch (error) {
      console.error('Error creating challenge:', error);
      res.status(500).json({ error: 'Failed to create challenge' });
    }
};

const getActiveChallenges = async (req, res) => {
  const { id } = req.userid;
  // console.log(id)

  try {
    const challenges = await Challenge.find({
      $and: [
        { $or: [{ challenger: id }, { opponent: id }] },
        { status: 'active' }
      ]
    })
      .populate('challenger opponent', 'profileImage username realName')
      .sort({ endDate: -1 });

    const formattedChallenges = await Promise.all(
      challenges.map(async (challenge) => {
        const challenger = await User.findById(challenge.challenger._id).select(challenge.criterion);
        const opponent = await User.findById(challenge.opponent._id).select(challenge.criterion);
        // console.log(challenger)
        return {
          criterion: challenge.criterion,
          startValueChallenger: challenge.startValueChallenger,
          startValueOpponent: challenge.startValueOpponent,
          currentValueChallenger: challenger[challenge.criterion],
          currentValueOpponent: opponent[challenge.criterion],
          challenger: {
            username: challenge.challenger.username,
            realName: challenge.challenger.realName,
            profileImage: challenge.challenger.profileImage
          },
          opponent: {
            username: challenge.opponent.username,
            realName: challenge.opponent.realName,
            profileImage: challenge.opponent.profileImage
          },
          status: challenge.status,
          result: challenge.result,
          startDate: challenge.startDate,
          endDate: challenge.endDate
        };
      })
    );

    res.status(200).json({ success: true, challenges: formattedChallenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve challenges' });
  }
};

const getCompletedChallenges = async (req, res) => {
  const { id } = req.userid;
  // console.log(id)

  try {
    const challenges = await Challenge.find({
      $and: [
        { $or: [{ challenger: id }, { opponent: id }] },
        { status: 'completed' }
      ]
    })
      .populate('challenger opponent', 'profileImage username realName')
      .sort({ endDate: -1 });
      // console.log(challenges)

    
    res.status(200).json({ success: true, challenges: challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve challenges' });
  }
};


const getSelfChallenges = async (req, res) => {
  const { id } = req.userid;

  try {
    const selfChallenges = await SelfChallenge.find({ challenger: id })
      .populate('challenger', 'profileImage username realName')
      .sort({ endDate: -1 });

    const formattedSelfChallenges = await Promise.all(
      selfChallenges.map(async (selfChallenge) => {
        const user = await User.findById(selfChallenge.challenger._id).select(selfChallenge.criterion);
        
        return {
          criterion: selfChallenge.criterion,
          startValueChallenger: selfChallenge.startValueChallenger,
          currentValueChallenger: user[selfChallenge.criterion],
          targetValueChallenger: selfChallenge.targetValueChallenger,
          challenger: {
            username: selfChallenge.challenger.username,
            realName: selfChallenge.challenger.realName,
            profileImage: selfChallenge.challenger.profileImage
          },
          status: selfChallenge.status,
          result: selfChallenge.result,
          startDate: selfChallenge.startDate,
          endDate: selfChallenge.endDate
        };
      })
    );

    res.status(200).json({ success: true, selfChallenges: formattedSelfChallenges });
  } catch (error) {
    console.error('Error fetching self-challenges:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve self-challenges' });
  }
};

const endChallenge = async (req, res) => {
    const { challengeId } = req.params;
  
    try {
      const challenge = await Challenge.findById(challengeId)
        // console.log(challenge)
      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }
  
      if (challenge.status !== 'active') {
        return res.status(400).json({ error: 'Challenge already ended' });
      }
  
      const challengerEndValue = await User.findById(challenge.challenger._id).select(challenge.criterion);
        const opponentEndValue = await User.findById(challenge.opponent._id).select(challenge.criterion);
      if (challengerEndValue === undefined || opponentEndValue === undefined) {
        return res.status(400).json({ error: 'End values not found for both participants' });
      }
  
      let result = 'tie';
      if (challengerEndValue > opponentEndValue) {
        result = 'challenger';
      } else if (opponentEndValue > challengerEndValue) {
        result = 'opponent';
      }
  
      challenge.endValueChallenger = challengerEndValue;
      challenge.endValueOpponent = opponentEndValue;
      challenge.status = 'completed';
      challenge.result = result;
      await challenge.save();
  
      res.status(200).json({ message: 'Challenge ended', result });
    } catch (error) {
      console.error('Error ending challenge:', error);
      res.status(500).json({ error: 'Failed to end challenge' });
    }
  };

  // const getPendingRequests = async (req, res) => {
  //   try {
  //     const { id } = req.userid;

  //     const pendingRequests = await Challenge.find({
  //       $and: [
  //         { $or: [{ challenger: id }, { opponent: id }] },
  //         { request: 'pending' }
  //       ]
  //     })
  //       .populate('challenger opponent', 'profileImage username realName')
  //       .sort({ endDate: -1 });
  //     res.status(200).json({ requests: pendingRequests });
  //   } catch (error) {
  //     console.error("Error fetching pending requests:", error);
  //     res.status(500).json({ error: "Failed to fetch pending requests." });
  //   }
  // };
  
  // /**
  //  * Approve a challenge request by its ID.
  //  */
  // const approveChallenge = async (req, res) => {
  //   try {
  //     const { requestId } = req.body; // Challenge request ID
  //     const { userId } = req.user; // Assuming user is authenticated and userId is available in req.user
  
  //     const challenge = await Challenge.findById(requestId);
  
  //     if (!challenge) {
  //       return res.status(404).json({ error: "Challenge not found." });
  //     }
  
  //     if (challenge.opponentId.toString() !== userId) {
  //       return res.status(403).json({ error: "You are not authorized to approve this challenge." });
  //     }
  
  //     // Update challenge status to "approved"
  //     challenge.status = "approved";
  //     await challenge.save();
  
  //     res.status(200).json({ message: "Challenge approved successfully.", challenge });
  //   } catch (error) {
  //     console.error("Error approving challenge:", error);
  //     res.status(500).json({ error: "Failed to approve challenge." });
  //   }
  // };
  
  

export {getActiveChallenges,getCompletedChallenges,getSelfChallenges,createChallenge,createSelfChallenge, endChallenge}



// export const updateChallengeProgress = async (req, res) => {
//     const { challengeId } = req.params;
  
//     try {
//       const challenge = await Challenge.findById(challengeId);
//       if (!challenge) {
//         return res.status(404).json({ error: 'Challenge not found' });
//       }

//       if (challenge.status!="active") {
//         return res.status(404).json({ error: 'Challenge completed' });
//       }
  
//       const { criterion } = challenge;
//       const challenger = await User.findById(challenge.challenger).select(criterion);
//       const opponent = challenge.opponent ? await User.findById(challenge.opponent).select(criterion) : null;
  
//       // Update current values
//       challenge.currentValueChallenger = challenger[criterion];
//       challenge.currentValueOpponent = opponent ? opponent[criterion] : null;
  
//       // Calculate win probability
//       let winProbability = null;
//       if (opponent) {
//         const total = challenge.currentValueChallenger + challenge.currentValueOpponent;
//         challenge.winProbability = (challenge.currentValueChallenger / total) * 100; // 50% if total is 0
//       }
//       else {
//         challenge.progress = (challenge.currentValueChallenger-challenge.startValueChallenger)/100
//       }
  
//       await challenge.save();
  
//       res.status(200).json({
//         message: 'Challenge progress updated successfully',
//         progress: {
//           challenger: {
//             currentValue: challenge.currentValueChallenger,
//             startValue: challenge.startValueChallenger,
//           },
//           opponent: opponent
//             ? {
//                 currentValue: challenge.currentValueOpponent,
//                 startValue: challenge.startValueOpponent,
//               }
//             : null,
//           winProbability,
//         },
//       });
//     } catch (error) {
//       console.error('Error updating challenge progress:', error);
//       res.status(500).json({ error: 'Failed to update challenge progress' });
//     }
//   };