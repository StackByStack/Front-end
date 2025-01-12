import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { apiImage } from '../apis/api';
import Poster from './Poster';
import { formatDate, trimText } from './utils';
import Votes from './Votes';

type HorizontalProps = {
  id: number;
  title: string;
  poster: string;
  overview: string;
  releaseDate?: string;
  isTv: boolean;
};

const Container = styled.View`
  padding: 0px 30px;
  margin-bottom: 30px;
  flex-direction: row;
  align-items: flex-start;
`;
const Data = styled.View`
  align-items: flex-start;
  width: 60%;
  margin-left: 25px;
`;
const Title = styled.Text`
  color: white;
  font-weight: bold;
  margin-bottom: 10px;
`;
const ReleaseDate = styled.Text`
  color: white;
  font-size: 12px;
`;
const Overview = styled.Text`
  color: white;
  margin-top: 10px;
`;
export default ({
  isTv = false,
  id,
  title,
  poster,
  overview,
  releaseDate
}: HorizontalProps) => {
  const navigation = useNavigation();
  const goToDetail = () => {
    navigation.navigate('Detail', {
      isTv,
      id,
      title,
      poster,
      overview,
      releaseDate
    });
  };
  return (
    <TouchableOpacity onPress={goToDetail}>
      <Container>
        <Poster url={poster} />
        <Data>
          <Title>{trimText(title, 30)}</Title>
          {releaseDate ? <ReleaseDate>{formatDate(releaseDate)}</ReleaseDate> : null}
          <Overview>{trimText(overview, 130)}</Overview>
        </Data>
      </Container>
    </TouchableOpacity>
  );
};
