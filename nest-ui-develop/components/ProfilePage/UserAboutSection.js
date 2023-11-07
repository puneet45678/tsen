import Image from "next/image";
import Globe from "../../icons/Globe";
import SocialMediaIcon from "../../icons/SocialMediaIcons";

const UserAboutSection = ({ videoUrl, description, user }) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const joining = new Date(user?.createdAt);
  return (
    <>
      <div className="flex justify-start gap-16">
        <div className="max-w-[912px]">
          {videoUrl ? (
            <div className="aspect-[912/495] mb-9">
              <video
                autoPlay
                muted
                loop
                src={videoUrl}
                className="h-full rounded-md"
              />
            </div>
          ) : (
            <div className="bg-light-neutral-700 rounded-md w-[912px] h-[495px]" />
          )}
          <div className="flex flex-col ">
            <h3 className="text-lg font-sans font-semibold text-dark-neutral-700 my-8">
              Biography
            </h3>
            {description ? <div>{description}</div> : <div>No description</div>}
          </div>
        </div>
        <aside className="flex flex-col gap-y-12 ">
          <div className="border px-8 py-6 rounded-md border-light-neutral-600 bg-light-neutral-50">
            <div className="flex h-full flex-col justify-between gap-6 text-lg font-normal">
              <div className="flex gap-3">
                <span>
                  <Image
                    src="/SVG/Location_Pin.svg"
                    height={20}
                    width={20}
                    alt="locationPin"
                  />
                </span>
                {user?.accountInformation?.country}
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5">
                  <Globe />
                </div>
                {user?.displayInformation?.website
                ?(<a href={user?.displayInformation?.website}>
                  {user?.displayInformation?.website}
                </a>)
                :(
                  <span>- - - - -</span>
                )
                }
              </div>
              <div className="text-dark-neutral-50">
                Joined {user && months[joining.getMonth()]},{" "}
                {user && joining.getFullYear()}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 max-w-[317px]">
            <h3 className="text-dark-neutral-200 font-semibold text-lg">
              Area of expertise
            </h3>
            <div className="flex flex-wrap gap-3">
              {user?.expertise
                ?user.expertise?.map((e, index) => (
                  <div
                    key={"EachExpertiseSkillUserProfileTag" + index}
                    className="px-[14px] py-2 rounded-[100px] bg-light-neutral-50"
                  >
                    {e.skill}
                  </div>
                ))
                :(
                  <div>Not mentioned</div>
                )
              }
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full mt-12">
            <h3 className="text-dark-neutral-200 font-semibold text-lg">
              Social Links
            </h3>
            <div className="flex flex-col gap-2">
              {user?.socialMediaLinks?.length>0
                ?user.socialMediaLinks.map((e, index) => (
                <div key={"EachUserDisplaySocialLinksProfile" + index}>
                  <div
                    className="flex items-center gap-2 capitalize"
                    href={e.url}
                    target="_blank"
                  >
                    <div className=" p-[9px]">
                      <div className="w-6 h-6">
                        <SocialMediaIcon name={e.platform} />
                      </div>
                    </div>
                    <a className="hover:text-primary-purple-500 hover:underline hover:cursor-pointer">
                      {e.platform}
                    </a>
                  </div>
                </div>
              )):(
                <div>
                  None provided  
                </div>
              )
              }
            </div>
          </div>
        </aside>
      </div>
    </>
  );
};
export default UserAboutSection;
