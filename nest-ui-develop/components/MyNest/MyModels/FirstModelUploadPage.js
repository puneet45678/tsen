import React, { useState } from "react";

const FirstModelUploadPage = (props) => {
  const [gotItValue, setGotItValue] = useState(false);

  return (
    <div className="grid gap-5 px-10 py-5">
      <h1 className="font-medium text-[20px]">Ready for your first upload?</h1>
      <p>
        Please take note of the following guidelines to make the experience fun
        for you and the community.
      </p>
      <p>
        <span className="font-medium">Post your own work</span> - You are
        talented, and the community wants to see your work. So publish the
        models that you have created or have the permission to publish. Refrain
        from uploading someone else&apos;s work.
      </p>
      <p>
        <span className="font-medium">Mark sensitive content</span> - We
        understand that artists need freedom to express themselves. However, to
        ensure that your work reaches the right eyes, please let us and the
        community know if your work is sensitive. 3. Post only 3D content - This
        is a marketplace for 3D art, 3D printers and 3D hobbyists. Upload only
        that work which is 3D. Otherwise, it will be removed.
      </p>
      <p>
        <span className="font-medium">Post only 3D content</span> - This is a
        marketplace for 3D art, 3D printers and 3D hobbyists. Upload only that
        work which is 3D. Otherwise, it will be removed.
      </p>
      <div className="flex items-center gap-2">
        <input
          id="confirmation"
          type="checkbox"
          className="accent-primary-brand h-5 w-5"
          value={gotItValue}
          onChange={(event) => setGotItValue(event.target.checked)}
        />
        <label htmlFor="confirmation" className="font-medium">
          Ok, I got it
        </label>
      </div>
      <div>
        <button
          className="bg-black text-white h-10 px-5 rounded-[5px]"
          disabled={!gotItValue}
          onClick={props.handleContinueClick}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
export default FirstModelUploadPage;
