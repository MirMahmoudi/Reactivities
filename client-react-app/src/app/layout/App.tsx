import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashBoard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

function App() {
  const {key} = useLocation();
  return (
    <>
      <Route exact path='/' component={HomePage}/>
      <Route path={'/(.+)'}
        render = {() => (
          <>
            <NavBar/>
            <Container style={{marginTop:'6em'}}>
              <Route exact path='/activities' component={ActivityDashBoard}/>
              <Route exact path='/activities/:id' component={ActivityDetails}/>
              <Route key={key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
