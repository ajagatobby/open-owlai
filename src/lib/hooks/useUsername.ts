import { useState, useEffect } from "react";

const useRandomUsername = (email: string) => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const generateUsername = () => {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let randomUsername = "";

      // Generate a random 6-character username
      for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomUsername += characters.charAt(randomIndex);
      }

      // Append a portion of the email to the username
      const emailParts = email.split("@");
      const emailUsername = emailParts[0];
      const maxEmailLength = 4;
      const truncatedEmail = emailUsername.slice(0, maxEmailLength);
      const finalUsername = `${truncatedEmail}_${randomUsername}`;

      setUsername(finalUsername);
    };

    if (email) {
      generateUsername();
    }
  }, [email]);

  return username;
};

export default useRandomUsername;
