import React, { FC } from "react";
import GoogleLogin from "react-google-login";
import Column from "../../components/Column";
import { useAuthContext } from "../../InfiniteContext";
import { PrayQuestionBoxContainer } from "./localPrayStyle";

type Props = {
  okTempHandler: () => void;
  cancelTemp: () => void;
  select: () => void;
};

const clientId = "1076100753398-65qgajcbv8mfg22hdba71bsjem77tmev.apps.googleusercontent.com";

const PrayQuestionBox: FC<Props> = ({ okTempHandler, cancelTemp, select }) => {
  const email = localStorage.getItem("email");
  const { setMyEmail } = useAuthContext();

  const onSuccess = async (response: any) => {
    const {
      profileObj: { email },
    } = response;

    localStorage.setItem("email", email);
    setMyEmail(email);
    okTempHandler();
  };

  const onFailure = (error: any) => {
    console.log(error);
  };

  return (
    <PrayQuestionBoxContainer
      style={{
        color: "green",

        transform: "translateX(-50%)",
      }}
      className={"fade-in-top"}
    >
      <span>Would you like to pray for this place?</span>
      <Column isRow={true} gap={4}>
        {!email ? (
          <GoogleLogin
            clientId={clientId}
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            buttonText="Google Login"
            render={(renderProps) => (
              <button
                onClick={() => {
                  renderProps.onClick();
                }}
              >
                Yes
              </button>
            )}
          />
        ) : (
          <>
            <button onClick={okTempHandler}>Yes</button>
          </>
        )}

        <button
          onClick={() => {
            setTimeout(cancelTemp, 100);
          }}
        >
          No
        </button>
      </Column>
    </PrayQuestionBoxContainer>
  );
};

export default PrayQuestionBox;
