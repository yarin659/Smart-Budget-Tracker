import styled from "styled-components";

export const MoodEmoji = ({ income, expenses }) => {
  const mood =
    expenses > income ? "🤬" :
    income > expenses ? "😌" :
    "😐";

  return <Box>{mood}</Box>;
};

const Box = styled.div`
  font-size: 3rem;
  padding: 8px;
`;
