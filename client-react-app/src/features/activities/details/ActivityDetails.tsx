import { observer } from 'mobx-react-lite';
import { Button, Card, Image } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';

function ActivityDetails() {

    const { activityStore } = useStore();
    const {selectedActivity: activity, cancelSelectedActivity, openForm} = activityStore;

    if(!activity) return <LoadingComponent content='Loading ...'/>;

    return (
        <Card fluid>
            <Image src={`assets/categoryImages/${activity.category}.jpg`} alt={`${activity.category}`}/>
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>{activity.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group>
                    <Button onClick={()=>openForm(activity.id)} basic color='blue' content='Edit'/>
                    <Button onClick={cancelSelectedActivity} basic color='grey' content='Cancel'/>
                </Button.Group>
            </Card.Content>
        </Card>
    )
}

export default observer(ActivityDetails);