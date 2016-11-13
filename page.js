function getCoor(latLng) {
    var currentLat = latLng.lat();
    var currentLng = latLng.lng();
    var UTM;

    switch (DATUM) {
        case "MGRSED50":
            var fl = flwgs84toed50(currentLat, currentLng);
            UTM = fl2EDMGRS(fl[0], fl[1]);
            document.getElementById('d2').innerHTML = '<font size="2.5"  style="position:absolute;top:20;left:15" face="Times" color="#000000">MGRS (ED 50)' + '<br>' + UTM[1] + ' ' + UTM[2] + UTM[3] + '  ' + UTM[4] + '  ' + UTM[5] + '</font>';
            break;
        case "UTMED50":
            var fl = flwgs84toed50(currentLat, currentLng);
            UTM = fl2EDMGRS(fl[0], fl[1]);
            document.getElementById('d2').innerHTML = '<font size="2.5"  style="position:absolute;top:20;left:15" face="Times" color="#000000">UTM (ED 50)' + '<br>' + Math.round(UTM[6]) + ' ' + Math.round(UTM[7]) + '</font>';
            break;
        case "MGRSWGS84":
            UTM = fl2MGRS(currentLat, currentLng);
            document.getElementById('d2').innerHTML = '<font size="2.5"  style="position:absolute;top:20;left:15" face="Times" color="#000000">MGRS (WGS 84)' + '<br>' + UTM[1] + ' ' + UTM[2] + UTM[3] + '  ' + UTM[4] + '  ' + UTM[5] + '</font>';
            break;
        case "UTMWGS84":
            UTM = fl2MGRS(currentLat, currentLng);
            document.getElementById('d2').innerHTML = '<font size="2.5"  style="position:absolute;top:20;left:15" face="Times" color="#000000">UTM (WGS 84)' + '<br>' + Math.round(UTM[6]) + ' ' + Math.round(UTM[7]) + '</font>';
            break;
        case "WGS84":
            document.getElementById('d2').innerHTML = '<font size="2.5"  style="position:absolute;top:20;left:15" face="Times" color="#000000">Lng - Lat (WGS 84)' + '<br>' + Math.round(currentLat * 10000000) / 10000000 + '  ' + Math.round(currentLng * 10000000) / 10000000 + '</font>';
            break;
        case "EGSA87":
            UTM = fl2EGSA87(currentLat, currentLng);
            document.getElementById('d2').innerHTML = '<font size="2.5"  style="position:absolute;top:20;left:15" face="Times" color="#000000">EGSA 87' + '<br>' + Math.round(UTM[0] * 100) / 100 + ' , ' + Math.round(UTM[1] * 100) / 100 + '</font>';
            break;
        default:
            break;

    }
}


function getCoorStr(latLng) {
    var currentLat = latLng.lat();
    var currentLng = latLng.lng();
    var UTM;

    var fl = flwgs84toed50(currentLat, currentLng);
    UTM = fl2EDMGRS(fl[0], fl[1]);
    return ' MGRS <br>    ' + UTM[1] + ' ' + UTM[2] + UTM[3] + ' ' + UTM[4] + ' ' + UTM[5];
}



function setwut() {
    var f = 1.0 * document.getElementById("f").value;
    var l = 1.0 * document.getElementById("l").value;

    UTM = fl2MGRS(f, l);
    document.getElementById("wutx").value = Math.round(UTM[6] * 10) / 10;
    document.getElementById("wuty").value = Math.round(UTM[7] * 10) / 10;

    document.getElementById("wzone").value = (UTM[1]);
    document.getElementById("wsquare").value = (UTM[2] + UTM[3]);
    document.getElementById("wx").value = (UTM[4]);
    document.getElementById("wy").value = (UTM[5]);

    var zz = " ";
    var zz = (UTM[1]);
    document.getElementById("utzz2").value = zz.substring(0, zz.length - 1);
}


function setflms() {
    var f = 1.0 * document.getElementById("f").value;
    var l = 1.0 * document.getElementById("l").value;

    document.getElementById("fo").value = Math.floor(f);
    var sec = Math.floor(60 * (f - Math.floor(f)))
    document.getElementById("fm").value = sec;
    var seccc = Math.round(3600 * (f - Math.floor(f) - sec / 60) * 1000) / 1000;
    if (seccc == 60) { seccc = 59.999 };
    document.getElementById("fs").value = seccc;


    document.getElementById("lo").value = Math.floor(l);
    var sec = Math.floor(60 * (l - Math.floor(l)))
    document.getElementById("lm").value = sec;
    var seccc = Math.round(3600 * (l - Math.floor(l) - sec / 60) * 1000) / 1000;
    if (seccc == 60) { seccc = 59 };
    document.getElementById("ls").value = seccc;
}

function setedut() {
    var f = 1.0 * document.getElementById("f").value;
    var l = 1.0 * document.getElementById("l").value;

    var fl = flwgs84toed50(f, l);
    UTM = fl2EDMGRS(fl[0], fl[1]);
    document.getElementById("edutx").value = Math.round(UTM[6] * 10) / 10;
    document.getElementById("eduty").value = Math.round(UTM[7] * 10) / 10;

    document.getElementById("edzone").value = (UTM[1]);
    document.getElementById("edsquare").value = (UTM[2] + UTM[3]);
    document.getElementById("edx").value = (UTM[4]);
    document.getElementById("edy").value = (UTM[5]);

    var zz = (UTM[1]);
    //alert(zz);
    document.getElementById("utzz1").value = zz.substring(0, zz.length - 1);
}


function setEgsa() {
    var f = 1.0 * document.getElementById("f").value;
    var l = 1.0 * document.getElementById("l").value;

    var UTM = fl2EGSA87(f, l);
    document.getElementById("egx").value = Math.round(UTM[0] * 100) / 100;
    document.getElementById("egy").value = Math.round(UTM[1] * 100) / 100;
}

function flchanged() {
    setflms();
    setEgsa();
    setwut();
    setedut();
}


function flmschanged() {
    var fo = 1.0 * document.getElementById("fo").value;
    var fm = 1.0 * document.getElementById("fm").value;
    var fs = 1.0 * document.getElementById("fs").value;

    var lo = 1.0 * document.getElementById("lo").value;
    var lm = 1.0 * document.getElementById("lm").value;
    var ls = 1.0 * document.getElementById("ls").value;


    document.getElementById("f").value = Math.round((fo + fm / 60 + fs / 3600) * 1000000) / 1000000;
    document.getElementById("l").value = Math.round((lo + lm / 60 + ls / 3600) * 1000000) / 1000000;
    setEgsa();
    setwut();
    setedut();
}


function edutchanged() {
    var x = 1.0 * document.getElementById("edutx").value;
    var y = 1.0 * document.getElementById("eduty").value;
    var z = 1.0 * document.getElementById("utzz1").value;

    var fl0 = ED50_xy2fl(x, y, z, 0);
    var fl = fled50towgs84(fl0[0], fl0[1], 0);
    document.getElementById("f").value = Math.round((fl[0]) * 1000000) / 1000000;
    document.getElementById("l").value = Math.round((fl[1]) * 1000000) / 1000000;
    setflms();
    setEgsa();
    setwut();

    var f = 1.0 * document.getElementById("f").value;
    var l = 1.0 * document.getElementById("l").value;

    var fl = flwgs84toed50(f, l);
    UTM = fl2EDMGRS(fl[0], fl[1]);
    //document.getElementById("edutx").value = Math.round(UTM[6]); 
    //document.getElementById("eduty").value = Math.round(UTM[7]);


    document.getElementById("edzone").value = (UTM[1]);
    document.getElementById("edsquare").value = (UTM[2] + UTM[3]);
    document.getElementById("edx").value = (UTM[4]);
    document.getElementById("edy").value = (UTM[5]);
}


function wutchanged() {
    var x = 1.0 * document.getElementById("wutx").value;
    var y = 1.0 * document.getElementById("wuty").value;
    var z = 1.0 * document.getElementById("utzz2").value;

    var fl = UTM_xy2fl(x, y, z, 0);

    document.getElementById("f").value = Math.round((fl[0]) * 1000000) / 1000000;
    document.getElementById("l").value = Math.round((fl[1]) * 1000000) / 1000000;
    setflms();
    setEgsa();

    setedut();
    var f = 1.0 * document.getElementById("f").value;
    var l = 1.0 * document.getElementById("l").value;

    UTM = fl2MGRS(f, l);

    document.getElementById("wzone").value = (UTM[1]);
    document.getElementById("wsquare").value = (UTM[2] + UTM[3]);
    document.getElementById("wx").value = (UTM[4]);
    document.getElementById("wy").value = (UTM[5]);
}


function wmgrschanged() {

    var x = 1.0 * document.getElementById("wx").value;
    var y = 1.0 * document.getElementById("wy").value;
    var z = document.getElementById("wzone").value;
    var t = document.getElementById("wsquare").value;

    if (t.length == 2) {
        if (check_zone_letter_1(z.substring(0, z.length - 1) * 1, t.substring(0, 1))) {

            var UTM = MGRS2UTM(z, t, x, y);

            document.getElementById("wutx").value = Math.round(UTM[0] * 10) / 10;
            document.getElementById("wuty").value = Math.round(UTM[1] * 10) / 10;

            var x = 1.0 * document.getElementById("wutx").value;
            var y = 1.0 * document.getElementById("wuty").value;
            var z = 1.0 * document.getElementById("utzz2").value;

            var fl = UTM_xy2fl(x, y, z, 0);

            document.getElementById("f").value = Math.round((fl[0]) * 1000000) / 1000000;
            document.getElementById("l").value = Math.round((fl[1]) * 1000000) / 1000000;
            setflms();
            setEgsa();
            setedut();
        } else { alert("�������� ���� �� ����� ��������� 100 ��") }
    }
}

function edmgrschanged() {

    var x = 1.0 * document.getElementById("edx").value;
    var y = 1.0 * document.getElementById("edy").value;
    var z = document.getElementById("edzone").value;
    var t = document.getElementById("edsquare").value;


    if (t.length == 2) {
        if (check_zone_letter_1(z.substring(0, z.length - 1) * 1, t.substring(0, 1))) {
            var UTM = MGRS2UTM(z, t, x, y);

            document.getElementById("edutx").value = Math.round(UTM[0] * 10) / 10;
            document.getElementById("eduty").value = Math.round(UTM[1] * 10) / 10;
            document.getElementById("utzz1").value = z.substring(0, z.length - 1);

            var x = 1.0 * document.getElementById("edutx").value;
            var y = 1.0 * document.getElementById("eduty").value;
            var z = 1.0 * document.getElementById("utzz1").value;

            var fl0 = ED50_xy2fl(x, y, z, 0);
            var fl = fled50towgs84(fl0[0], fl0[1], 0);
            document.getElementById("f").value = Math.round((fl[0]) * 1000000) / 1000000;
            document.getElementById("l").value = Math.round((fl[1]) * 1000000) / 1000000;
            setflms();
            setEgsa();
            setwut();
        } else { alert("�������� ���� �� ����� ��������� 100 ��") }
    }
}


function egsachanged() {

    var x = 1.0 * document.getElementById("egx").value;
    var y = 1.0 * document.getElementById("egy").value;

    var Eg = Egsa2fl84(x, y);

    document.getElementById("f").value = Math.round((Eg[0]) * 10000000) / 10000000;
    document.getElementById("l").value = Math.round((Eg[1]) * 10000000) / 10000000;
    setflms();
    setwut();
    setedut();
}


window.onresize = pos;

function pos() {
    if (navigator.appName == 'Microsoft Internet Explorer') {
        document.getElementById('topcontainer').style.left = (document.body.offsetWidth / 2 - 350) + 'px';
    } else {
        document.getElementById('topcontainer').style.left = window.innerWidth / 2 - 350;
    }
}


function set_new_base() {

    var x1 = document.getElementById("eg1x").value * 1.0;
    var y1 = document.getElementById("eg1y").value * 1.0;
    var h1 = document.getElementById("eg1h").value * 1.0;

    var dx = document.getElementById("gcx").value * 1.0;
    var dy = document.getElementById("gcy").value * 1.0;
    var dz = document.getElementById("gcz").value * 1.0;

    var fl = Egsa2fl84(x1, y1);
    var xyz = flh2xyz(fl[0], fl[1], h1, "WGS84")
    //console.log(fl);
    //console.log(xyz);

    xyz[0] += dx;
    xyz[1] += dy;
    xyz[2] += dz;

    flh = xyz2flh(xyz[0], xyz[1], xyz[2], "WGS84");
    //console.log(flh);
    var xy = fl2EGSA87(flh[0], flh[1]);
    //console.log(xy);

    document.getElementById("eg2x").value = Math.round(xy[0] * 1000) / 1000;
    document.getElementById("eg2y").value = Math.round(xy[1] * 1000) / 1000;
    document.getElementById("eg2h").value = Math.round(flh[2] * 1000) / 1000;
}



