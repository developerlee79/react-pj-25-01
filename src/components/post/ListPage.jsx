import { Button, Table } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebase'
import { getFirestore, collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const ListPage = () => {

    const db = getFirestore(app);
    const email = sessionStorage.getItem('email');
    const navi = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [last, setLast] = useState(1);

    // 게시글 목록가져오기 함수
    const getList = () => {
        const q = query(collection(db, 'post'), orderBy('date', 'desc'));
        const rows = [];
        setLoading(true);
        let no = 0;
        onSnapshot(q, snapshot => {
            snapshot.forEach(row => {
                no = no + 1;
                const start = (page - 1) * 5 + 1;
                const end = page * 5;
                if (no >= start && no <= end) {
                    rows.push({ no: no, id: row.id, ...row.data() });
                }
            });

            console.log(rows);
            setPosts(rows);
            setLast(Math.ceil(no / 5));
            setLoading(false);
        });
    }

    useEffect(() => {
        getList();
    }, [page])

    const onClickWrite = () => {
        if (email) {
            navi('/post/write')
        } else {
            sessionStorage.setItem('target', '/post/write')
            navi('/login');
        }
    }

    if (loading) return <h1 className='text-center my-4'> 로딩중! </h1>

    return (
        <div>
            <h1 className='my-4 text-center'>게시판</h1>
            <div className='mb-2'>
                <Button onClick={onClickWrite}
                    className='px-5' size='sm' variant="dark">글쓰기</Button>
            </div>
            <Table hover striped bordered >
                <thead>
                    <tr>
                        <td> No. </td>
                        <td> Title </td>
                        <td> Writer </td>
                        <td> Date </td>
                    </tr>
                </thead>
                <tbody>
                    {posts.map(post =>
                        <tr key={post.no}>
                            <td>{post.no}</td>
                            <td>{post.title}</td>
                            <td>{post.email}</td>
                            <td>{post.date}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <div className='text-center'>
                <Button onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    size='sm' className='px-3' variant='dark'>이전</Button>
                <span className='mx-3'>{page} / {last} </span>
                <Button onClick={() => setPage(page + 1)}
                    disabled={page === last}
                    size='sm' className='px-3' variant='dark'>다음</Button>
            </div>
        </div>
    )
}

export default ListPage
