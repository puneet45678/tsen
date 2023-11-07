const SectionLayout = ({
  heading,
  subHeading,
  children,
  showMandatoryFieldsText,
}) => {
  return (
    <div className="grid gap-6 w-full bg-white rounded-[5px] px-8 py-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-headline-xs text-dark-neutral-700 font-semibold">
          {heading}
        </h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 text-dark-neutral-50 text-lg w-full">
            <span>{subHeading}</span>
            {showMandatoryFieldsText && (
              <span className="italic">*Mandatory fields</span>
            )}
          </div>
          <div className="h-[1px] w-full bg-light-neutral-600"></div>
        </div>
      </div>
      {children}
    </div>
  );
};
export default SectionLayout;
