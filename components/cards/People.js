import { React, useContext } from 'react';
import { Avatar, List } from 'antd';
import { UserContext } from '../../context';
import Link from 'next/link';



export default function People({ people, handleFollow, handleUnfollow }) {
    const [state] = useContext(UserContext);

    const imageSource = (user) => {
        if (user.image) {
            return user.image.url;
        }
        else {
            return "/images/profile.jpg"
        }
    }

    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={people}
                renderItem={(person) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={imageSource(person)} />}
                            title={
                                <div className='d-flex justify-content-between'>
                                    <Link href={`/user/${person.username}`}> {person.username} </Link>
                                    {state && state.user && state.user.following && state.user.following.includes(person._id) ? (
                                        <span onClick={() => handleUnfollow(person)} className='text-primary cursorr'>Unfollow</span>
                                    ) : (
                                        <span onClick={() => handleFollow(person)} className='text-primary cursorr'>Follow</span>
                                    )}

                                </div>
                            }
                        // description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                        />
                    </List.Item>
                )}
            />

        </>
    );
};
