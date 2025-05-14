import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-5M79YXM87T");
};

export const logPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
