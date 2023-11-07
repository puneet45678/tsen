import EditorViewer from "./renderer/EditorViewer";

const AboutTheCampaign = (props) => {
  return (
    <>
      <div className="bg-white rounded-sm w-[75%] h-fit px-14 py-2">
        <EditorViewer data={props.description} />
      </div>
      <div className="w-[25%] pb-5 px-5">
        {/* <div className="w-full font-medium">
          <div className="mb-2 w-max text-primary-brand text-[24px]">
            Tier 1
          </div>
          <div className="flex flex-col w-full border-[1px] border-accent1">
            <div className="w-full bg-white h-[250px]"></div>
            <div className="flex flex-col px-4">
              <div className="flex justify-between font-medium my-2">
                <div className="flex flex-col">
                  <p className="text-[20px] text-primary-brand">
                    Name of the tier
                  </p>
                  <p className="text-secondary-text-paragraph-text text-[14px]">
                    <span className="text-black">62</span> backers
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <button className="mt-2 py-2 px-5 w-full rounded-sm bg-primary-brand text-white">
                    Add to cart
                  </button>
                  <p className="text-primary-brand">US $ 50</p>
                </div>
              </div>
              <div className="font-medium text-secondary-text-paragraph-text text-[14px]">
                Description goes here for this tier. Description goes here for
                this tier. Description goes here for this tier. Description goes
                here for this tier. Description goes here Description goes here
                for this tier.
              </div>
              <div className=" w-max rounded-[30px] px-5 font-medium bg-accent1 text-secondary-text-icons-button-text my-3 text-[12px]">
                Add Bonus Support (optional)
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default AboutTheCampaign;
