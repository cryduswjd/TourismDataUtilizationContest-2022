"use strict"

const pairDAO = require("../model/pairDAO");
const decoDAO = require("../model/decoDAO");
const alarmDAO = require("../model/alarmDAO");

//짝궁 리스트 보여주기
async function pair_list(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;

        //user_key의 post_key select
        let get_post_key = await pairDAO.get_post_key(user_key);
        get_post_key = get_post_key[0].post_key;

        //post_key의 작성자 select
        let post_user_key = await pairDAO.post_user_key(get_post_key);

        let db_data = await pairDAO.pair_list_user(get_post_key);
        let host_key = await pairDAO.post_host_key(get_post_key);
        host_key = host_key[0].user_key;

        res.json({
            "db_data": db_data,
            "host_key": host_key,
            "post_key": get_post_key
        })
    } catch (err) {
        console.log(err)
        res.send("짝궁 리스트 오류");
    }
}

//큐알에 쓰이는 정보 보내주기 - 사용자버전
async function qr_info(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
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
        const qr = req.params.qr; //qr == user_key 값임

        let parameter = { post_key, qr };

        //user_key, post_key에 해당하는 데이터의 connect = 1로 update
        const db_data = await pairDAO.user_connect(parameter);

        res.send({ result: "success" });
    } catch (err) {
        console.log(err)
        res.send({ result: 'QR 인증 오류' })
    }
}

//사용자 비활성화 시키기(짝궁 리스트에서 x버튼 눌렀을 때)
async function user_disable(req, res, next) {
    try {
        const mate_key = req.params.mate_key;
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        
        const parameter = { mate_key, user_key };
        let db_data = await pairDAO.user_connect_zero(parameter);
        //pairDB에서도 권한을 0으로 바꿔 모든 기능 stop
        db_data = await pairDAO.pair_auth_stop(parameter);

        res.send({ result: "success" });
    } catch (err) {
        res.send('사용자 비활성화 실패')
    }
}

//사용자 활성화 시키기
async function user_restart(req, res, next) {
    try {
        const mate_key = req.params.mate_key;
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;

        const parameter = { mate_key, user_key };
        let db_data = await pairDAO.user_connect_one(parameter);
        //pairDB에서도 권한을 1로 바꿔 모든 기능 실행
        db_data = await pairDAO.pair_auth_start(parameter);

        res.send({ result: "success" });
    } catch (err) {
        res.send('사용자 활성화 실패')
    }
}

//사진 공유
async function photo_share(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const photo = req.files;

        //post_key와 user_key를 사용하여 mate_key 불러오기
        let parameter = { post_key, user_key };
        let mate_key = await pairDAO.load_mate_key_forUser(parameter);
        mate_key = mate_key[0].mate_key;

        for (let i in photo) {
            let img = photo[i].filename;
            parameter = { mate_key, user_key, img };
            const db_data = await pairDAO.save_photo(parameter);
        }

        //첫 사진 공유 시 훈장 지급
        const cnt = await pairDAO.count_share(user_key);

        if( cnt[0].user_key_cnt==1 ) {
            let send_deco = await decoDAO.send_deco(14); 
            let deco_data = send_deco[0];

            let alarm_data = await alarmDAO.alarm_content(4);
            alarm_data = alarm_data[0].msg;

            const msg = deco_data.content + " " + alarm_data;

            let parameter = { user_key, msg, post_key };
            const insert_alarm_data = await alarmDAO.deco_save(parameter);

            parameter = { user_key, deco_key: 14 };
            const db_daco = await decoDAO.insert_deco(parameter);

            const alarm_key = insert_alarm_data.insertId;

            res.send({ result: post_key, deco_data, alarm_data, alarm_key });
        } else {
            res.send({ result: "success" });
        }
    } catch (err) {
        console.log(err)
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

//짝궁 메인(최근 사진 10개만)
async function show_photo(req, res, next) {
    try {
        const post_key = req.params.post_key;

        const db_data = await pairDAO.load_photo(post_key);

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
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;

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
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const todo = req.body.todo;

        let parameter = { post_key, user_key };
        let mate_key = await pairDAO.load_mate_key_forUser(parameter);
        mate_key = mate_key[0].mate_key;

        parameter = { mate_key, user_key, todo };
        const db_data = await pairDAO.save_todo(parameter);

        res.send({ result: "success" });
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
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;

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

        let user_key_;  let rating;

        if (user_keys.length >= 2) {
            user_key_ = user_keys.split(', ');
            rating = ratings.split(', ');
        }

        else {
            user_key_ = user_keys;
            rating = ratings;
        }

        const user_len = user_key_.length;

        for(let i=0; i<user_len; i++) {
            let user_key = user_key_[i];
            let rate = rating[i];
            let parameter = { post_key, user_key };
            console.log(parameter)

            let mate_key = await pairDAO.load_mate_key_forUser(parameter);
            mate_key = mate_key[0].mate_key;

            parameter = { mate_key, post_key, user_key, rate };
            console.log(parameter)

            let db_data = await pairDAO.user_rating(parameter);
            let disconnect = await pairDAO.disconnect(parameter);
            let trip_end = await pairDAO.end_of_trip(parameter);
            let type_zero = await pairDAO.type_zero(user_key);
        };  
        res.send({ result: "success" });
    } catch (err) {
        console.log(err)
        res.send('평가 오류')
    }
}

module.exports = {
    pair_list,
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
    pair_rate
}