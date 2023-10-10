import { useEffect, useState } from 'react';
import axios from 'axios';
import AutoList from './AutoList';
// import { audiCar, bmwCar, mercCar, ladaCar, toyotaCar, mitsubCar } from './carsImages'
import Loader from '../loader/Loader';
import Categories from './Categories';
import { useSelector } from 'react-redux';
import { setCotegoryId } from '../redux/slices/filterSlice';
import { RootState, useAppDispatch } from '../redux/store';



export type AutoType = {
  id:number;
  brand:string;
  price:string;
  imageUrl:string;
  year:string;
}

const Auto:React.FC = () => {
  const [autos, setAutos] = useState<AutoType[]>();
  const [autosLoading, setAutosLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');
  const dispatch = useAppDispatch();
  const activeCathegorie = useSelector((state:RootState) => state.filters.categiriesId);

  useEffect(() => {
    setAutosLoading(true);
    axios
      .get<AutoType[]>(
        `https://64cbc2282eafdcdc85194590.mockapi.io/autos?${
          activeCathegorie > 0 ? `category=${activeCathegorie}` : ''
        }`,
      )
      .then((res) => {
        setAutos(res.data);
        setAutosLoading(false);
        setLoadError('');
      })
      .catch((e) => {
        setLoadError(e.message);
        setAutosLoading(false);
      });
  }, [activeCathegorie]);




  return (
    <div>
      <h1 className='title'>Choose your dream</h1>
      <Categories
        activeCategorie={activeCathegorie}
        onClickCategorie={(id:number) => dispatch(setCotegoryId(id))}
      />

      {loadError && <strong className='error__load'>An error has occurred ${loadError}!!!</strong>}

      {!autos  ? (
        <div className='loader__block'>
          {!loadError &&  <Loader />}
        
        </div>
      ) : (
        <div>
   
          <AutoList  autos={autos} changeAutos={setAutos} />
        </div>
      )}
    </div>
  );
};

export default Auto;