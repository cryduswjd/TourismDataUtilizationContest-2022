"use strict"

const pairDAO = require("../model/pairDAO");

//큐알에 쓰이는 정보 보내주기 - 사용자버전
async function qr_info(req, res, next) {
    try {
        const user_key = req.params.user_key;
        const db_data = await pairDAO.load_user_id(user_key);

        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send('OR 정보 전송 오류')
    }
}

//큐알 체크 - 호스트버전
async function qr_check(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const qr = req.body.qr; //qr == user_id 값임

        let parameter = { post_key, qr };

        //user_id값 가져옴
        let qr_data = await pairDAO.user_check(parameter);
        qr_data = qr_data[0].id;

        //user_key값 가져옴
        let id_to_key = await pairDAO.get_user_key(qr_data);
        id_to_key = id_to_key[0].user_key;

        parameter = {post_key, id_to_key};

        //user_key, post_key에 해당하는 데이터의 connect = 1로 update
        const db_data = await pairDAO.user_connect(parameter);

        res.send('success');
    } catch (err) {
        res.send('OR 인증 오류')
    }
}

//사용자 비활성화 시키기(짝궁 리스트에서 x버튼 눌렀을 때)
async function user_disable(req, res, next) {
    try {
        const mate_key = req.params.mate_key;
        const user_key = req.params.user_key;
        
        const parameter = { mate_key, user_key };
        let db_data = await pairDAO.user_connect_zero(parameter);
        //pairDB에서도 권한을 0으로 바꿔 모든 기능 stop
        db_data = await pairDAO.pair_auth_stop(parameter);

        res.send('success');
    } catch (err) {
        res.send('사용자 비활성화 실패')
    }
}

//사용자 활성화 시키기
async function user_restart(req, res, next) {
    try {
        const mate_key = req.params.mate_key;
        const user_key = req.params.user_key;

        const parameter = { mate_key, user_key };
        let db_data = await pairDAO.user_connect_one(parameter);
        //pairDB에서도 권한을 1로 바꿔 모든 기능 실행
        db_data = await pairDAO.pair_auth_start(parameter);

        res.send('success');
    } catch (err) {
        res.send('사용자 활성화 실패')
    }
}

//사진 공유(짝궁 메인)
async function photo_share(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = req.params.user_key;
        const photo = req.files;

        //사진 한번에 받아서 DB에 한 줄씩 넣기
        let str = "";
        for (let i in photo) {
            str += photo[i].filename + ", ";
        }
        const string = str.slice(0, -2);

        //post_key와 user_key를 사용하여 mate_key 불러오기
        let parameter = { post_key, user_key };
        let mate_key = await pairDAO.load_mate_key(parameter);
        mate_key = mate_key[0].mate_key;

        parameter = { mate_key, user_key, string };
        const db_data = await pairDAO.save_photo(parameter);

        res.send('success');
    } catch (err) {
        res.send('사진 공유 오류')
    }
}

const paging = (currentPage, pageSize) => {
    const default_start_page = 0;
    const page_size = pageSize;
    if (currentPage < 0 || !currentPage) currentPage = default_start_page;
    let result = {
        offset: (currentPage) * page_size,
        limit: Number(page_size)
    }
    return result;
}

//공유된 사진 불러오기
async function show_photo(req, res, next) {
    try {
        const mate_key = req.params.mate_key;

        let currentPage = req.query.page;
        const pageSize = 10;
        const page = paging(currentPage, pageSize);

        const parameter = {
            mate_key: mate_key,
            offset: page.offset,
            limit: page.limit
        }

        const db_data = await pairDAO.load_photo(parameter);

        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send('사진 불러오기 오류')
    }
}

//사진 전체보기 눌렀을 때
async function show_all_photo(req, res, next){
    try{
        const mate_key = req.params.mate_key;
        const user_key = req.params.user_key;

        let currentPage = req.query.page;
        const pageSize = 15;
        const page = paging(currentPage, pageSize);

        const parameter = {
            mate_key: mate_key,
            user_key: user_key,
            offset: page.offset,
            limit: page.limit
        }

        console.log(parameter)
        const db_data = await pairDAO.user_load_photo(parameter);

        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send('사진 불러오기 오류');
    }
}

//여행 계획 공유
async function todo_list(req, res, next) {
    try{
        const post_key = req.params.post_key;
        const user_key = req.params.user_key;
        const todo = req.body.todo;

        let parameter = { post_key, user_key };
        let mate_key = await pairDAO.load_mate_key(parameter);
        mate_key = mate_key[0].mate_key;

        parameter = { mate_key, user_key, todo };
        const db_data = await pairDAO.save_todo(parameter);

        res.send('success');
    } catch (err) {
        res.send('여행 계획 추가 오류')
    }
}

//여행 계획 보여주기
async function show_todo_list(req, res, next) {
    try{
        const mate_key = req.params.mate_key;
        const db_data = await pairDAO.load_todo(mate_key);

        res.json({
            "db_data": db_data
        })
    } catch (err) {
        res.send('여행 계획 불러오기 오류')
    }
}

//짝궁 평가 할 때 사용자 프로필 불러오기
async function rating_user_info(req, res, next) {
    try{
        const post_key = req.params.post_key;
        const user_key = req.params.user_key;

        const parameter = { post_key, user_key };
        const db_data = await pairDAO.user_profile_info(parameter);

        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send('사용자 정보를 불러올 수 없습니다.')
    }
}

//짝궁 평가 (여행 종료 버튼 눌렀을 때)
async function pair_rate(req, res, next) {
    try{
        const post_key = req.params.post_key;
        const user_keys = req.body.user_keys;
        const ratings = req.body.ratings;

        const user_key_ = user_keys.split(', ');
        const rating = ratings.split(', ');

        const user_len = user_key_.length;

        for(let i=0; i<user_len; i++) {
            let user_key = user_key_[i];
            let rate = rating[i];
            let parameter = { post_key, user_key };

            let mate_key = await pairDAO.load_mate_key_forUser(parameter);
            mate_key = mate_key[0].mate_key;

            parameter = { mate_key, post_key, user_key, rate };
            console.log(parameter)

            let db_data = await pairDAO.user_rating(parameter);
        };
        res.send('success');    
    } catch (err) {
        res.send('평가 오류')
    }
}

async function disconnect_pair(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_data = await pairDAO.load_mate_key_forPost(post_key);
        console.log(user_data[0].mate_key)

        for(let i=0; i<user_data.length; i++){
            let user_key = user_data[i].mate_key;
            const parameter = { post_key, user_key };

            const disconnect = await pairDAO.disconnect(parameter);
            const trip_end = await pairDAO.end_of_trip(parameter);
            const type_zero = await pairDAO.type_zero(user_key);
        }    

        res.send('success');
    } catch (err) {
        res.send('연결 끊기 오류');
    }
}

module.exports = {
    qr_info,
    qr_check,
    user_disable,
    user_restart,
    photo_share,
    show_photo,
    show_all_photo,
    todo_list,
    show_todo_list,
    rating_user_info,
    pair_rate,
    disconnect_pair
}