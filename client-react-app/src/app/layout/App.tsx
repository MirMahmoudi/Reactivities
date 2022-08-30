import { useEffect, useState } from 'react';
import axios from 'axios';
import { v4 as uuidV4 } from 'uuid';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashBoard';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
      .then(res => setActivities(res.data))
      .catch(err => console.log("Error", err))
  },[]);

  const handleCreateOrEditActivity = (activity : Activity) => {
    activity.id ?
      setActivities([...activities.filter(act => act.id !== activity.id), activity])
      : setActivities([...activities, {...activity, id: uuidV4()}]);

      setEditMode(false);
      setSelectedActivity(activity);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(act => act.id !== id));
  }

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.find(act => act.id === id));
  }

  const handleCancelActivity = () => {
    setSelectedActivity(undefined);
  }

  const handleFormOpen = (id?: string) => {
    id ? handleSelectActivity(id) : handleCancelActivity();
    setEditMode(true);
  }

  const handleFormClose = () => {
    setEditMode(false);
  }

  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop:'6em'}}>
        <ActivityDashBoard
          activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelActivity={handleCancelActivity}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEditActivity={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </>
  );
}

export default App;
