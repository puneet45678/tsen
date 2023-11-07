import UploadcareImage from "@uploadcare/nextjs-loader";

const GradientBackgroundLayout = ({ children }) => {
  return (
    <div className="flex justify-center items-center py-[90px] relative">
      <UploadcareImage
        src="/images/bg.png"
        alt="Background"
        className="w-full h-full absolute top-0 left-0"
        fill
      />
      <div className="bg-white border-[1px] rounded-[10px] border-light-neutral-700 w-[1496px] h-full z-10">
        {children}
      </div>
    </div>
  );
};

export default GradientBackgroundLayout;
