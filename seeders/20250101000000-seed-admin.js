'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        const passwordSuper = bcrypt.hashSync('admin123', 10);
        const passwordRuangan = bcrypt.hashSync('ruangan123', 10);

        const layoutTandon = {
            cols: 44,
            rows: 25,
            items: [
                { c1: 1, c2: 5, id: "rack_1770193415022_2dd68752120ea", r1: 22, r2: 23, name: "A7", type: "rack" },
                { c1: 6, c2: 10, id: "rack_1770193424361_e2867856d62b78", r1: 22, r2: 23, name: "A6", type: "rack" },
                { c1: 11, c2: 15, id: "rack_1770193431027_859b4ae1c721b8", r1: 22, r2: 23, name: "A5", type: "rack" },
                { c1: 16, c2: 20, id: "rack_1770193436475_7cf4c233bfc49", r1: 22, r2: 23, name: "A4", type: "rack" },
                { c1: 21, c2: 25, id: "rack_1770193441542_959caebb88731", r1: 22, r2: 23, name: "A3", type: "rack" },
                { c1: 26, c2: 30, id: "rack_1770193453924_5e37a973f97c38", r1: 24, r2: 25, name: "A2", type: "rack" },
                { c1: 31, c2: 35, id: "rack_1770193459797_f19753ddce7198", r1: 24, r2: 25, name: "A1", type: "rack" },
                { c1: 1, c2: 5, id: "rack_1770193472937_a0ff8c2e402ae", r1: 18, r2: 19, name: "B7", type: "rack" },
                { c1: 6, c2: 10, id: "rack_1770193477360_e2b750a5617fe8", r1: 18, r2: 19, name: "B6", type: "rack" },
                { c1: 11, c2: 15, id: "rack_1770193481178_a51c4eb6b551e8", r1: 18, r2: 19, name: "B5", type: "rack" },
                { c1: 16, c2: 20, id: "rack_1770193484893_4d387acaa6a98", r1: 18, r2: 19, name: "B4", type: "rack" },
                { c1: 21, c2: 25, id: "rack_1770193489041_dcf73046ad9e28", r1: 18, r2: 19, name: "B3", type: "rack" },
                { c1: 26, c2: 30, id: "rack_1770193495307_afc3e0400d0cb", r1: 18, r2: 19, name: "B2", type: "rack" },
                { c1: 31, c2: 35, id: "rack_1770193500896_6db9d6cd164098", r1: 18, r2: 19, name: "B1", type: "rack" },
                { c1: 1, c2: 5, id: "rack_1770193506346_9811dc33b7918", r1: 16, r2: 17, name: "C7", type: "rack" },
                { c1: 6, c2: 10, id: "rack_1770193509952_a05c271407b3a8", r1: 16, r2: 17, name: "C6", type: "rack" },
                { c1: 11, c2: 15, id: "rack_1770193514405_241df447c8a368", r1: 16, r2: 17, name: "C5", type: "rack" },
                { c1: 16, c2: 20, id: "rack_1770193517781_9ee5c239a75ea8", r1: 16, r2: 17, name: "C4", type: "rack" },
                { c1: 21, c2: 25, id: "rack_1770193521127_3efcbe77e9242", r1: 16, r2: 17, name: "C3", type: "rack" },
                { c1: 26, c2: 30, id: "rack_1770193526138_7721674ddc762", r1: 16, r2: 17, name: "C2", type: "rack" },
                { c1: 31, c2: 35, id: "rack_1770193530692_8ed1516e97694", r1: 16, r2: 17, name: "C1", type: "rack" },
                { c1: 1, c2: 5, id: "rack_1770193538046_9b1a10f6d439e", r1: 12, r2: 13, name: "D7", type: "rack" },
                { c1: 6, c2: 10, id: "rack_1770193542961_0c53c4005a2a8", r1: 12, r2: 13, name: "D6", type: "rack" },
                { c1: 11, c2: 15, id: "rack_1770193546436_fafd7b1b891f1", r1: 12, r2: 13, name: "D5", type: "rack" },
                { c1: 16, c2: 20, id: "rack_1770193549977_0a17b2351c0738", r1: 12, r2: 13, name: "D4", type: "rack" },
                { c1: 21, c2: 25, id: "rack_1770193562768_aaf03cf033fb28", r1: 12, r2: 13, name: "D3", type: "rack" },
                { c1: 26, c2: 30, id: "rack_1770193573959_4d0e116e38991", r1: 12, r2: 13, name: "D2", type: "rack" },
                { c1: 31, c2: 35, id: "rack_1770193577884_b3bc7611108a28", r1: 12, r2: 13, name: "D1", type: "rack" },
                { c1: 1, c2: 5, id: "rack_1770193596049_7a3b7a28d573d", r1: 10, r2: 11, name: "E7", type: "rack" },
                { c1: 6, c2: 10, id: "rack_1770193599709_476b5716185f5", r1: 10, r2: 11, name: "E6", type: "rack" },
                { c1: 11, c2: 15, id: "rack_1770193603534_5c9420e74874c", r1: 10, r2: 11, name: "E5", type: "rack" },
                { c1: 16, c2: 20, id: "rack_1770193607215_d6c1417f4fce38", r1: 10, r2: 11, name: "E4", type: "rack" },
                { c1: 21, c2: 25, id: "rack_1770193625564_2af5324cc6afb", r1: 10, r2: 11, name: "E3", type: "rack" },
                { c1: 26, c2: 30, id: "rack_1770193632178_c037f898b8b27", r1: 10, r2: 11, name: "E2", type: "rack" },
                { c1: 31, c2: 35, id: "rack_1770193636855_5a02f3757f37d", r1: 10, r2: 11, name: "E1", type: "rack" },
                { c1: 1, c2: 5, id: "rack_1770193648534_44f68d41a7d88", r1: 6, r2: 7, name: "F7", type: "rack" },
                { c1: 6, c2: 10, id: "rack_1770193654248_fcb61bdc852538", r1: 6, r2: 7, name: "F6", type: "rack" },
                { c1: 11, c2: 15, id: "rack_1770193659583_fd9e5f859ce21", r1: 6, r2: 7, name: "F5", type: "rack" },
                { c1: 16, c2: 20, id: "rack_1770193664759_a3c3d0c2372458", r1: 6, r2: 7, name: "F4", type: "rack" },
                { c1: 21, c2: 25, id: "rack_1770193670956_4c9f4cc980e6b", r1: 6, r2: 7, name: "F3", type: "rack" },
                { c1: 26, c2: 30, id: "rack_1770193675256_e8beb33021cab", r1: 6, r2: 7, name: "F2", type: "rack" },
                { c1: 31, c2: 35, id: "rack_1770193680069_0f6732de6ef828", r1: 6, r2: 7, name: "F1", type: "rack" },
                { c1: 1, c2: 5, id: "rack_1770193688071_b07341356a9a4", r1: 4, r2: 5, name: "G7", type: "rack" },
                { c1: 6, c2: 10, id: "rack_1770193692029_cd1bb8681c38e8", r1: 4, r2: 5, name: "G6", type: "rack" },
                { c1: 11, c2: 15, id: "rack_1770193699771_1bfeac0d43876", r1: 4, r2: 5, name: "G5", type: "rack" },
                { c1: 16, c2: 20, id: "rack_1770193704715_4315dba78a20d", r1: 4, r2: 5, name: "G4", type: "rack" },
                { c1: 21, c2: 25, id: "rack_1770193708888_c9ce76b672733", r1: 4, r2: 5, name: "G3", type: "rack" },
                { c1: 26, c2: 30, id: "rack_1770193711969_3dc21f79f2f", r1: 4, r2: 5, name: "G2", type: "rack" },
                { c1: 31, c2: 35, id: "rack_1770193716147_754bd7fc56e438", r1: 4, r2: 5, name: "G1", type: "rack" },
                { c1: 34, c2: 38, id: "rack_1770193820989_519fdc23d16a58", r1: 1, r2: 2, name: "H5", type: "rack" },
                { c1: 43, c2: 44, id: "rack_1770193889066_0c13c5c9d00a28", r1: 13, r2: 18, name: "H2", type: "rack" },
                { c1: 38, c2: 39, id: "table_1770193923666_a946891cb75de", r1: 20, r2: 25, name: "Meja Pustakawan 1", type: "table" },
                { c1: 39, c2: 44, id: "table_1770193930093_702b0414c6878", r1: 5, r2: 6, name: "Meja Pustakawan 2", type: "table" },
                { c1: 43, c2: 44, id: "table_1770193940781_cbc0c1f9cba8f", r1: 7, r2: 12, name: "Meja Pustakawan 3", type: "table" },
                { c1: 41, c2: 43, id: "door_1770193962619_31d54b3281c018", r1: 25, r2: 25, name: "Pintu 1", type: "door" }
            ],
            version: 1
        };

        const layoutReferensi = {
            cols: 40,
            rows: 25,
            items: [
                { c1: 6, c2: 14, id: "lib_desk", r1: 3, r2: 4, name: "Meja Pustakawan", type: "table" },
                { c1: 2, c2: 5, id: "visit_h_1", r1: 22, r2: 23, name: "Meja Pengunjung", type: "table" },
                { c1: 6, c2: 9, id: "visit_h_2", r1: 22, r2: 23, name: "Meja Pengunjung", type: "table" },
                { c1: 10, c2: 13, id: "visit_h_3", r1: 22, r2: 23, name: "Meja Pengunjung", type: "table" },
                { c1: 15, c2: 16, id: "guest_book", r1: 17, r2: 18, name: "Buku Tamu", type: "table" },
                { c1: 37, c2: 39, id: "corner_red", r1: 22, r2: 23, name: "Meja Pojok", type: "table" },
                { c1: 17, c2: 18, id: "rack_top_0", r1: 2, r2: 7, name: "A1", type: "rack" },
                { c1: 20, c2: 21, id: "rack_top_1", r1: 2, r2: 7, name: "B1", type: "rack" },
                { c1: 23, c2: 24, id: "rack_top_2", r1: 2, r2: 7, name: "C1", type: "rack" },
                { c1: 26, c2: 27, id: "rack_top_3", r1: 2, r2: 7, name: "D1", type: "rack" },
                { c1: 29, c2: 30, id: "rack_top_4", r1: 2, r2: 7, name: "E1", type: "rack" },
                { c1: 32, c2: 33, id: "rack_top_5", r1: 2, r2: 7, name: "F1", type: "rack" },
                { c1: 35, c2: 36, id: "rack_top_6", r1: 2, r2: 7, name: "G1", type: "rack" },
                { c1: 38, c2: 39, id: "rack_top_7", r1: 2, r2: 7, name: "H1", type: "rack" },
                { c1: 17, c2: 18, id: "rack_bot_0", r1: 17, r2: 22, name: "A2", type: "rack" },
                { c1: 20, c2: 21, id: "rack_bot_1", r1: 17, r2: 22, name: "B2", type: "rack" },
                { c1: 23, c2: 24, id: "rack_bot_2", r1: 17, r2: 22, name: "C2", type: "rack" },
                { c1: 26, c2: 27, id: "rack_bot_3", r1: 17, r2: 22, name: "D2", type: "rack" },
                { c1: 29, c2: 30, id: "rack_gap", r1: 20, r2: 22, name: "E2", type: "rack" },
                { c1: 32, c2: 33, id: "rack_bot_5", r1: 17, r2: 22, name: "F2", type: "rack" },
                { c1: 35, c2: 36, id: "rack_bot_6", r1: 17, r2: 22, name: "G2", type: "rack" },
                { c1: 39, c2: 40, id: "rack_right_combined", r1: 16, r2: 21, name: "H2", type: "rack" },
                { c1: 14, c2: 15, id: "door_1769657464764_f13a0e17228768", r1: 24, r2: 24, name: "Pintu masuk", type: "door" },
                { c1: 1, c2: 2, id: "table_1769822607168_70818d4d7fddf8", r1: 9, r2: 12, name: "Meja Pengunjung 1", type: "table" },
                { c1: 1, c2: 2, id: "table_1769822612030_7dde19f2d2195", r1: 13, r2: 16, name: "Meja Pengunjung 2", type: "table" },
                { c1: 1, c2: 2, id: "table_1769822615680_ecbfcb01a1b43", r1: 17, r2: 20, name: "Meja Pengunjung 3", type: "table" },
                { c1: 2, c2: 3, id: "table_1769822797262_4a655047f8af08", r1: 3, r2: 6, name: "Meja Pustakawan 1", type: "table" },
                { c1: 31, c2: 36, id: "table_1769822875477_de0a24dc92c3c8", r1: 10, r2: 14, name: "Meja Pengunjung 4", type: "table" },
                { c1: 25, c2: 30, id: "table_1769822890443_ffde105bc16208", r1: 10, r2: 14, name: "Meja Pengunjung 5", type: "table" },
                { c1: 17, c2: 23, id: "table_1769822902449_a7024ef63ca6d8", r1: 10, r2: 14, name: "Meja Pengunjung 6", type: "table" }
            ],
            version: 1
        };

        const layoutAnak = {
            cols: 48,
            rows: 34,
            items: [
                { c1: 3, c2: 4, id: "rack_1770260731514_36b4ef6234eb3", r1: 2, r2: 6, name: "B1", type: "rack" },
                { c1: 3, c2: 4, id: "rack_1770260739290_6168a5539dd6a", r1: 7, r2: 11, name: "B2", type: "rack" },
                { c1: 3, c2: 4, id: "rack_1770260744938_ac0a3a05e178a", r1: 12, r2: 16, name: "B3", type: "rack" },
                { c1: 3, c2: 4, id: "rack_1770260748708_b7316176e0fb1", r1: 17, r2: 21, name: "B4", type: "rack" },
                { c1: 4, c2: 6, id: "door_1770260817685_354240cc0365c8", r1: 34, r2: 34, name: "Pintu 1", type: "door" },
                { c1: 5, c2: 6, id: "rack_1770260824963_21d3dce33a71b8", r1: 2, r2: 6, name: "A1", type: "rack" },
                { c1: 5, c2: 6, id: "rack_1770260827441_775dcae297d6a8", r1: 7, r2: 11, name: "A2", type: "rack" },
                { c1: 5, c2: 6, id: "rack_1770260831961_2df4947110dab8", r1: 12, r2: 16, name: "A3", type: "rack" },
                { c1: 5, c2: 6, id: "rack_1770260834417_c3751c2e33f8e8", r1: 17, r2: 21, name: "A4", type: "rack" },
                { c1: 9, c2: 13, id: "rack_1770260859887_1a550d0a2b5df", r1: 31, r2: 32, name: "D1", type: "rack" },
                { c1: 14, c2: 18, id: "rack_1770260863621_0bd91e6df28e18", r1: 31, r2: 32, name: "D2", type: "rack" },
                { c1: 19, c2: 23, id: "rack_1770260865964_6559cf27b9b708", r1: 31, r2: 32, name: "D3", type: "rack" },
                { c1: 24, c2: 28, id: "rack_1770260868494_2c33eae277118", r1: 31, r2: 32, name: "D4", type: "rack" },
                { c1: 29, c2: 33, id: "rack_1770260871630_2bb30d322e9218", r1: 31, r2: 32, name: "D5", type: "rack" },
                { c1: 34, c2: 38, id: "rack_1770260874262_f72517cf947688", r1: 31, r2: 32, name: "D6", type: "rack" },
                { c1: 39, c2: 43, id: "rack_1770260885348_10d4c112566048", r1: 31, r2: 32, name: "D7", type: "rack" },
                { c1: 44, c2: 48, id: "rack_1770260889328_e60d3fa6b8eb98", r1: 31, r2: 32, name: "D8", type: "rack" },
                { c1: 9, c2: 13, id: "rack_1770260943399_a1214a97e28308", r1: 29, r2: 30, name: "C1", type: "rack" },
                { c1: 14, c2: 18, id: "rack_1770260945692_19d7b4bd6845", r1: 29, r2: 30, name: "C2", type: "rack" },
                { c1: 19, c2: 23, id: "rack_1770260947356_5e5389c444d1e", r1: 29, r2: 30, name: "C3", type: "rack" },
                { c1: 24, c2: 28, id: "rack_1770260949244_0863b1780fcc58", r1: 29, r2: 30, name: "C4", type: "rack" },
                { c1: 29, c2: 33, id: "rack_1770260951304_f8c363a2693248", r1: 29, r2: 30, name: "C5", type: "rack" },
                { c1: 34, c2: 38, id: "rack_1770260954251_9d0470a756ae7", r1: 29, r2: 30, name: "C6", type: "rack" },
                { c1: 39, c2: 43, id: "rack_1770260958579_097558c9798778", r1: 29, r2: 30, name: "C7", type: "rack" },
                { c1: 44, c2: 48, id: "rack_1770260961697_d237991c50f2e8", r1: 29, r2: 30, name: "C8", type: "rack" },
                { c1: 40, c2: 41, id: "rack_1770260981028_4b9bf5052a9028", r1: 22, r2: 26, name: "E4", type: "rack" },
                { c1: 42, c2: 43, id: "rack_1770260985673_af2a29dc545d", r1: 22, r2: 26, name: "F4", type: "rack" },
                { c1: 40, c2: 41, id: "rack_1770260989549_5218bfdb1bbe6", r1: 17, r2: 21, name: "E3", type: "rack" },
                { c1: 42, c2: 43, id: "rack_1770260991643_7fbabf4657d27", r1: 17, r2: 21, name: "F3", type: "rack" },
                { c1: 40, c2: 41, id: "rack_1770261002021_1554682eaa815", r1: 12, r2: 16, name: "E2", type: "rack" },
                { c1: 42, c2: 43, id: "rack_1770261006923_4b686439222148", r1: 12, r2: 16, name: "F2", type: "rack" },
                { c1: 40, c2: 41, id: "rack_1770261075896_108abba9774e28", r1: 7, r2: 11, name: "E1", type: "rack" },
                { c1: 42, c2: 43, id: "rack_1770261079106_cd4cc107d43a48", r1: 7, r2: 11, name: "F1", type: "rack" },
                { c1: 37, c2: 39, id: "table_1770261239238_e64724f30a01b8", r1: 1, r2: 5, name: "Meja Pustakawan 1", type: "table" },
                { c1: 1, c2: 2, id: "table_1770261264317_06e5d715ebdf98", r1: 28, r2: 31, name: "Meja Buku Tamu 1", type: "table" },
                { c1: 34, c2: 37, id: "table_1770261316831_725ae443d2c6d8", r1: 7, r2: 13, name: "Meja Pengunjung 1", type: "table" },
                { c1: 34, c2: 37, id: "table_1770261321608_c8d1fb25b3b1c", r1: 14, r2: 20, name: "Meja Pengunjung 2", type: "table" },
                { c1: 31, c2: 37, id: "table_1770261695135_8621a33d994138", r1: 23, r2: 26, name: "Meja Pengunjung 3", type: "table" },
                { c1: 24, c2: 30, id: "table_1770261698325_9e68efc0888ff", r1: 23, r2: 26, name: "Meja Pengunjung 4", type: "table" }
            ],
            version: 1
        };

        const layoutDisabilitas = {
            cols: 24,
            rows: 25,
            items: [
                { c1: 1, c2: 2, id: "rack_1770255839121_48143c7ea9281", r1: 3, r2: 7, name: "C", type: "rack" },
                { c1: 1, c2: 2, id: "rack_1770255847874_66d130f2a865e", r1: 8, r2: 14, name: "B", type: "rack" },
                { c1: 1, c2: 2, id: "rack_1770255856044_83ce694e52472", r1: 15, r2: 21, name: "A", type: "rack" },
                { c1: 3, c2: 7, id: "rack_1770255876642_5f8f9b4c38a398", r1: 1, r2: 2, name: "D", type: "rack" },
                { c1: 8, c2: 12, id: "rack_1770255889250_15a89d19031e38", r1: 1, r2: 2, name: "E", type: "rack" },
                { c1: 13, c2: 18, id: "rack_1770255894416_bc7bc410b3557", r1: 1, r2: 2, name: "F", type: "rack" },
                { c1: 23, c2: 24, id: "rack_1770255906538_6e034c3947d8e8", r1: 1, r2: 7, name: "G", type: "rack" },
                { c1: 23, c2: 24, id: "rack_1770255912197_19b8901bde90f", r1: 8, r2: 13, name: "H", type: "rack" },
                { c1: 23, c2: 24, id: "rack_1770255922017_20f23ce6826218", r1: 14, r2: 19, name: "I", type: "rack" },
                { c1: 23, c2: 24, id: "rack_1770255929322_fb0859981a9478", r1: 20, r2: 25, name: "J", type: "rack" },
                { c1: 16, c2: 22, id: "table_1770255982516_669fd6584cf258", r1: 23, r2: 25, name: "Meja Pustakawan 1", type: "table" },
                { c1: 8, c2: 17, id: "table_1770256064359_2b60107c6e3b58", r1: 8, r2: 17, name: "Meja Pengunjung 1", type: "table" }
            ],
            version: 1
        };

        // Layout Default untuk Puskel
        const layoutDefault = { cols: 20, rows: 20, items: [], version: 1 };

        const layoutDeposit = {
            cols: 44,
            rows: 39,
            items: [
                { c1: 2, c2: 4, id: "door_1770261765902_3dc6bcfe57f268", r1: 1, r2: 1, name: "Pintu 1", type: "door" },
                { c1: 6, c2: 8, id: "table_1770261773085_cb82961eecae3", r1: 1, r2: 2, name: "Meja Buku Tamu 1", type: "table" },
                { c1: 11, c2: 12, id: "rack_1770261901957_6839a6f2b8e258", r1: 1, r2: 6, name: "A1", type: "rack" },
                { c1: 15, c2: 16, id: "rack_1770261906054_c6f24d44d4559", r1: 1, r2: 6, name: "B1", type: "rack" },
                { c1: 19, c2: 20, id: "rack_1770261908631_42efb65789c108", r1: 1, r2: 6, name: "C1", type: "rack" },
                { c1: 23, c2: 24, id: "rack_1770261912174_c5e29c8c35f5", r1: 1, r2: 6, name: "D1", type: "rack" },
                { c1: 27, c2: 28, id: "rack_1770261914629_d5a6122a86e74", r1: 1, r2: 6, name: "E1", type: "rack" },
                { c1: 31, c2: 32, id: "rack_1770261918369_41096e24cbeb08", r1: 1, r2: 6, name: "F1", type: "rack" },
                { c1: 35, c2: 36, id: "rack_1770261922050_d47bb22e0fdb", r1: 1, r2: 6, name: "G1", type: "rack" },
                { c1: 35, c2: 36, id: "rack_1770261929808_8f272bf891c3", r1: 7, r2: 12, name: "G2", type: "rack" },
                { c1: 39, c2: 40, id: "rack_1770261933768_5dec5ab8da7868", r1: 1, r2: 6, name: "H1", type: "rack" },
                { c1: 39, c2: 40, id: "rack_1770261936010_869864909683b", r1: 7, r2: 12, name: "H2", type: "rack" },
                { c1: 43, c2: 44, id: "rack_1770261938887_9802f8e6cde3c8", r1: 1, r2: 6, name: "I1", type: "rack" },
                { c1: 43, c2: 44, id: "rack_1770261942127_52ac447d4baf28", r1: 7, r2: 12, name: "I2", type: "rack" },
                { c1: 43, c2: 44, id: "rack_1770261951051_e5e5dc56855ab", r1: 13, r2: 18, name: "I3", type: "rack" },
                { c1: 43, c2: 44, id: "rack_1770262002079_277f34d79df508", r1: 20, r2: 25, name: "J1", type: "rack" },
                { c1: 43, c2: 44, id: "rack_1770262017487_fc6cd92e5d3ff8", r1: 26, r2: 31, name: "J2", type: "rack" },
                { c1: 43, c2: 44, id: "rack_1770262024034_5a0dd916402248", r1: 32, r2: 37, name: "J3", type: "rack" },
                { c1: 39, c2: 40, id: "rack_1770262141258_4adfd55d75587", r1: 34, r2: 39, name: "K3", type: "rack" },
                { c1: 39, c2: 40, id: "rack_1770262147715_64cd9227f7676", r1: 28, r2: 33, name: "K2", type: "rack" },
                { c1: 39, c2: 40, id: "rack_1770262162191_640dd874402d08", r1: 22, r2: 27, name: "K1", type: "rack" },
                { c1: 35, c2: 37, id: "table_1770262208518_c17b697b922b28", r1: 34, r2: 39, name: "Meja Pustakawan 1", type: "table" },
                { c1: 29, c2: 34, id: "rack_1770262299443_54b6be947ab7", r1: 38, r2: 39, name: "L1", type: "rack" },
                { c1: 19, c2: 24, id: "rack_1770262339104_7ca9bd095734d", r1: 38, r2: 39, name: "M1", type: "rack" },
                { c1: 15, c2: 16, id: "rack_1770262357783_74a2a719dfb658", r1: 34, r2: 39, name: "N1", type: "rack" },
                { c1: 3, c2: 4, id: "rack_1770262385738_8e2d3e948a9f", r1: 34, r2: 39, name: "O1", type: "rack" },
                { c1: 1, c2: 2, id: "rack_1770262394578_b776da0be8a03", r1: 28, r2: 33, name: "P1", type: "rack" },
                { c1: 7, c2: 14, id: "table_1770262413642_26ab02073d1dc8", r1: 34, r2: 36, name: "Meja Pustakawan 2", type: "table" },
                { c1: 7, c2: 15, id: "table_1770262440016_3632dd95ff4338", r1: 22, r2: 27, name: "Meja Pengunjung 1", type: "table" },
                { c1: 16, c2: 24, id: "table_1770262446014_a2df080c49c1", r1: 22, r2: 27, name: "Meja Pengunjung 2", type: "table" },
                { c1: 30, c2: 35, id: "table_1770262472385_0ec3bef21c2c9", r1: 16, r2: 26, name: "Meja Pengunjung 3", type: "table" }
            ],
            version: 1
        };

        // 0. Hapus data lama jika ada (agar seed bisa dijalankan ulang)
        await queryInterface.bulkDelete('ruangan', null, {});
        await queryInterface.bulkDelete('users', {
            username: ['admin', 'admin_referensi', 'admin_tandon', 'admin_puskel', 'admin_anak', 'admin_disabilitas', 'admin_deposit']
        }, {});

        // 1. Masukkan data ke tabel 'users'
        await queryInterface.bulkInsert('users', [
            {
                id: 1,
                username: 'admin',
                password: passwordSuper,
                role: 'super_admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                username: 'admin_referensi',
                password: passwordRuangan,
                role: 'admin_ruangan',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 3,
                username: 'admin_tandon',
                password: passwordRuangan,
                role: 'admin_ruangan',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 4,
                username: 'admin_puskel',
                password: passwordRuangan,
                role: 'admin_ruangan',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 5,
                username: 'admin_anak',
                password: passwordRuangan,
                role: 'admin_ruangan',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 6,
                username: 'admin_disabilitas',
                password: passwordRuangan,
                role: 'admin_ruangan',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 7,
                username: 'admin_deposit',
                password: passwordRuangan,
                role: 'admin_ruangan',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);

        // 2. Hubungkan admin ke tabel 'ruangan'
        await queryInterface.bulkInsert('ruangan', [
            {
                id_ruangan: 1,
                nama_ruangan: 'Ruangan Referensi',
                id_admin_ruangan: 2, // Merujuk ke id admin_referensi
                layout_json: JSON.stringify(layoutReferensi),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id_ruangan: 2,
                nama_ruangan: 'Ruangan Tandon',
                id_admin_ruangan: 3,
                layout_json: JSON.stringify(layoutTandon),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id_ruangan: 3,
                nama_ruangan: 'Ruangan Pustaka Keliling',
                id_admin_ruangan: 4,
                layout_json: JSON.stringify(layoutDefault),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id_ruangan: 4,
                nama_ruangan: 'Ruangan Anak',
                id_admin_ruangan: 5,
                layout_json: JSON.stringify(layoutAnak),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id_ruangan: 5,
                nama_ruangan: 'Ruangan Disabilitas',
                id_admin_ruangan: 6,
                layout_json: JSON.stringify(layoutDisabilitas),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id_ruangan: 6,
                nama_ruangan: 'Ruang Deposit',
                id_admin_ruangan: 7,
                layout_json: JSON.stringify(layoutDeposit),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        // Hapus data dari kedua tabel dalam urutan yang benar (child first)
        await queryInterface.bulkDelete('ruangan', null, {});
        await queryInterface.bulkDelete('users', {
            username: ['admin', 'admin_referensi', 'admin_tandon', 'admin_puskel', 'admin_anak', 'admin_disabilitas', 'admin_deposit']
        }, {});
    }
};