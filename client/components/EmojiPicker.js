import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";

const EmojiPicker = ({ message, setMessage }) => {
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  return (
    <div className="absolute bottom-[60px] right-0 z-50">
      <Picker
        onEmojiClick={(e, emojiObject) =>
          setMessage(message.concat(emojiObject.emoji))
        }
        disableAutoFocus={true}
        skinTone={SKIN_TONE_MEDIUM_DARK}
        groupNames={{ smileys_people: "PEOPLE" }}
        native
      />
    </div>
  );
};

export default EmojiPicker;
