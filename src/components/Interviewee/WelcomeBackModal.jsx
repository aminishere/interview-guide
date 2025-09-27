import React from "react";
import { Modal, Button } from "../common";

const WelcomeBackModal = ({ isOpen, onResume, onRestart }) => {
  return (
    <Modal isOpen={isOpen} title="Welcome Back">
      <p>You have an unfinished interview. Do you want to resume?</p>
      <div className="flex space-x-2 mt-4">
        <Button onClick={onResume}>Resume</Button>
        <Button onClick={onRestart}>Restart</Button>
      </div>
    </Modal>
  );
};

export default WelcomeBackModal;
