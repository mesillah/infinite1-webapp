import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FC } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { PrayType, swrFetcher } from "../../interface";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PrevPrayText = styled.div`
  font-size: 1rem;
  line-height: 1.4375em;
  letter-spacing: 0.00938em;

  border: 1px solid #c9c9c9;
  border-radius: 4px;

  margin: 40px;
  padding: 16.5px 14px;
  color: rgba(0, 0, 0, 0.87);
`;

const ChainModal: FC<{
  position: { lat: number; lng: number };
  close(): void;
}> = ({ position, close }) => {
  const [open, setOpen] = React.useState(true);
  const { register, handleSubmit } = useForm();

  const email = localStorage.getItem("email");

  const { data, error } = useSWR<Array<PrayType>>(
    email ? `/api/v1/pray/${email}/${position.lat}/${position.lng}` : null,
    swrFetcher
  );
  console.log(data);
  const onSubmit = async (data: any) => {
    const email = localStorage.getItem("email");
    await axios
      .post(
        `/api/v1/${email}/pray`,
        {},
        { headers: { Authorization: `Bearer ${email}` } }
      )
      .then((res) => {
        console.log("res: ", res);
      });
  };

  if (error) {
  }

  if (!data) {
    return <div></div>;
  }

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={close}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography
              sx={{ ml: 2, flex: 1, textAlign: "center" }}
              variant="h6"
              component="div"
            >
              Carry on this Prayer Chain
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={close}
              aria-label="close"
              sx={{ position: "absolute", right: 20 }}
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {data.map((pray, index) => (
          <PrevPrayText key={"pray" + index}>{pray.content}</PrevPrayText>
        ))}
        <TextField
          variant="outlined"
          placeholder="Let's Pray"
          multiline
          rows={8}
          sx={{ padding: 5 }}
          {...register("content")}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Button variant="outlined" onClick={close}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Submit
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default ChainModal;
