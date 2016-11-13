/*
Created by Ioannis Sofos
gs.sofos@gmail.com
*/

var kan = new Array();
var kanN = 0;
var kanPut = false;


var lkan = new Array();
var lkanN = 0;
var lkanPut = false;

var DATUM = "MGRSED50";

var ED_a = 6378388.0;
var ED_f = 1 / 297.00000564939;
var ED_e = Math.sqrt(2 * ED_f - ED_f * ED_f);
var ED_b = 6356911.946;

var wgs84_a = 6378137;
var wgs84_f = 1 / 298.257223563;
var wgs84_e = Math.sqrt(2 * wgs84_f - wgs84_f * wgs84_f);
var wgs84_b = 6356752.314;

var eg_a = 6378137;
var eg_f = 1 / 298.257222101;
var eg_e = Math.sqrt(0.00669438);
var eg_b = 6356752.314;

eg_a = wgs84_a;
eg_b = wgs84_b;
eg_f = wgs84_f;
eg_e = wgs84_e;

var pi = Math.PI;

rad = function (x) { return x * Math.PI / 180; }

function dist00(p1, p2) {
    var R = 6371000; // earth's mean radius in km
    var dLat = rad(p2.lat() - p1.lat());
    var dLong = rad(p2.lng() - p1.lng());

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}


function flh2xyz(f, l, h, Ell) {
    if (h == undefined) { h = 0; }
    if (Ell == undefined) { Ell = "WGS84"; }
    var a;
    var e;
    if (Ell == "WGS84") { a = eg_a; e = eg_e }
    if (Ell == "ED50") { a = ED_a; e = ED_e }

    var par = Math.sqrt(1 - (e * e * Math.sin(f * pi / 180) * Math.sin(f * pi / 180)));
    var n = a / (Math.sqrt(1 - (e * e * Math.sin(f * pi / 180) * Math.sin(f * pi / 180))));

    var x = (n + h) * Math.cos(f * pi / 180) * Math.cos(l * pi / 180);
    var y = (n + h) * Math.cos(f * pi / 180) * Math.sin(l * pi / 180);
    var z = (n * (1 - e * e) + h) * Math.sin(f * pi / 180);

    var out = new Array();
    out[0] = x;
    out[1] = y;
    out[2] = z;

    return out;
}


function xyz2flh(x, y, z, Ell) {

    if (Ell == undefined) { Ell = "WGS84"; }
    var a;
    var e;
    var ff;
    if (Ell == "WGS84") { a = eg_a; e = eg_e; ff = eg_f; }
    if (Ell == "ED50") { a = ED_a; e = ED_e; ff = ED_f; }

    var l = Math.atan(y / x);

    var ge = e * e / (1 - e * e);
    var gb = a * (1 - ff);
    var gp = Math.sqrt(x * x + y * y);
    var gq = Math.atan((z * a) / (gp * gb));
    var f = Math.atan((z + ge * gb * Math.sin(gq) * Math.sin(gq) * Math.sin(gq)) / (gp - e * e * a * Math.cos(gq) * Math.cos(gq) * Math.cos(gq)));

    var h = (gp / Math.cos(f)) - a / Math.sqrt(1 - (e * e * Math.sin(f) * Math.sin(f)));

    var out = new Array();
    out[0] = f * 180 / pi;
    out[1] = l * 180 / pi;
    out[2] = h;

    return out;
}


function fled50towgs84(f, l, h) {
    if (h == undefined) { h = 0; }

    var xyz = flh2xyz(f, l, h, "ED50");

    ED_x = xyz[0];
    ED_y = xyz[1];
    ED_z = xyz[2];

    var dx = -84.0;
    var dy = -95.0;
    var dz = -130.0;

    var W_x = ED_x + dx;
    var W_y = ED_y + dy;
    var W_z = ED_z + dz;

    var out = xyz2flh(W_x, W_y, W_z, "WGS84");

    return out;
}


function flwgs84toed50(f, l, h) {

    if (h == undefined) { h = 0; }

    var xyz = flh2xyz(f, l, h, "WGS84");

    W_x = xyz[0];
    W_y = xyz[1];
    W_z = xyz[2];


    var dx = 84.0;
    var dy = 95.0;
    var dz = 130.0;

    var ED_x = W_x + dx;
    var ED_y = W_y + dy;
    var ED_z = W_z + dz;


    var out = xyz2flh(ED_x, ED_y, ED_z, "ED50");

    return out;
}


function fl2EDMGRS(f1, l1) {
    var f = f1;
    var l = l1;

    var lt = l + 180;
    this.GridZoneL = Math.floor(lt / 6) + 1;

    var ft = f + 80;
    ft = Math.floor(ft / 8) + 1;

    switch (ft) {
        case 1:
            this.GridZoneF = 'C';
            break;
        case 2:
            this.GridZoneF = 'D';
            break;
        case 3:
            this.GridZoneF = 'E';
            break;
        case 4:
            this.GridZoneF = 'F';
            break;
        case 5:
            this.GridZoneF = 'G';
            break;
        case 6:
            this.GridZoneF = 'H';
            break;
        case 7:
            this.GridZoneF = 'J';
            break;
        case 8:
            this.GridZoneF = 'K';
            break;
        case 9:
            this.GridZoneF = 'L';
            break;
        case 10:
            this.GridZoneF = 'M';
            break;
        case 11:
            this.GridZoneF = 'N';
            break;
        case 12:
            this.GridZoneF = 'P';
            break;
        case 13:
            this.GridZoneF = 'Q';
            break;
        case 14:
            this.GridZoneF = 'R';
            break;
        case 15:
            this.GridZoneF = 'S';
            break;
        case 16:
            this.GridZoneF = 'T';
            break;
        case 17:
            this.GridZoneF = 'U';
            break;
        case 18:
            this.GridZoneF = 'V';
            break;
        case 19:
            this.GridZoneF = 'W';
            break;
        case 20:
            this.GridZoneF = 'X';
            break;
        case 21:
            ft = 20;
            this.GridZoneF = 'C';
            break;
    }

    this.GridZone = this.GridZoneL + this.GridZoneF;

    var Fo = 0;
    var Lo = this.GridZoneL * 6 - 3;
    var w = 6;
    Lo = Lo - 180;
    var k0 = 0.9996;

    Fo = Fo * pi / 180;
    Lo = Lo * pi / 180;
    f = f * pi / 180;
    l = l * pi / 180;

    var e = ED_e;
    var a = ED_a;

    var pT = Math.tan(f) * Math.tan(f);
    var pC = (Math.pow(e, 2)) * (Math.pow(Math.cos(f), 2)) / (1 - Math.pow(e, 2));
    var pA = (l - Lo) * Math.cos(f);
    var pn = a / Math.sqrt(1 - (e * e) * (Math.sin(f) * Math.sin(f)));


    var pM = (1 - Math.pow(e, 2) / 4 - 3 * Math.pow(e, 4) / 64 - 5 * Math.pow(e, 6) / 256) * f;
    pM = pM - (3 * Math.pow(e, 2) / 8 + 3 * Math.pow(e, 4) / 32 + 45 * Math.pow(e, 6) / 1024) * Math.sin(2 * f);
    pM = pM + (15 * Math.pow(e, 4) / 256 + 45 * Math.pow(e, 6) / 1024) * Math.sin(4 * f);
    pM = pM - (35 * Math.pow(e, 6) / 3072) * Math.sin(6 * f);
    pM = pM * a;

    pM0 = (1 - Math.pow(e, 2) / 4 - 3 * Math.pow(e, 4) / 64 - 5 * Math.pow(e, 6) / 256) * Fo;
    pM0 = pM0 - (3 * Math.pow(e, 2) / 8 + 3 * Math.pow(e, 4) / 32 + 45 * Math.pow(e, 6) / 1024) * Math.sin(2 * Fo);
    pM0 = pM0 + (15 * Math.pow(e, 4) / 256 + 45 * Math.pow(e, 6) / 1024) * Math.sin(4 * Fo);
    pM0 = pM0 - (35 * Math.pow(e, 6) / 3072) * Math.sin(6 * Fo);
    pM0 = pM0 * a;

    var et = Math.sqrt(e * e / (1 - e * e));

    //Compute UTM X
    //Ypolohismos UTM X
    var XX = 500000 + k0 * pn * (pA + (1 - pT + pC) * pA * pA * pA / 6 + (5 - 18 * pT + pT * pT + 72 * pC - 58 * et * et) * pA * pA * pA * pA * pA / 120);

    //Compute UTM Y
    //Ypolohismos UTM Y
    var YY = pA * pA / 2;
    YY = YY + (5 - pT + 9 * pC + 4 * pC * pC) * pA * pA * pA * pA / 24;
    YY = YY + (61 - 58 * pT + pT * pT + 600 * pC - 330 * et * et) * Math.pow(pA, 6) / 720;
    YY = YY * pn * Math.tan(f);
    YY = YY + pM - pM0;
    YY = YY * k0;
    YY = YY;

    //Y offset for South Hemisphere
    if (f < 0) { YY = YY + 10000000; }


    z100x = Math.floor((XX) / 100000);
    z100y = Math.floor((YY) / 100000);

    var x100;
    x100 = ((this.GridZoneL - (Math.floor(this.GridZoneL / 3) * 3)) - 1) * 8 + z100x;
    if (x100 < 0) { x100 = x100 + 24; };
    var y100;
    y100 = z100y - Math.floor(z100y / 20) * 20 + 1;

    //Letter Square
    var LX100;
    var LY100;

    switch (x100) {
        case 1:
            LX100 = 'A';
            break;
        case 2:
            LX100 = 'B';
            break;
        case 3:
            LX100 = 'C';
            break;
        case 4:
            LX100 = 'D';
            break;
        case 5:
            LX100 = 'E';
            break;
        case 6:
            LX100 = 'F';
            break;
        case 7:
            LX100 = 'G';
            break;
        case 8:
            LX100 = 'H';
            break;
        case 9:
            LX100 = 'J';
            break;
        case 10:
            LX100 = 'K';
            break;
        case 11:
            LX100 = 'L';
            break;
        case 12:
            LX100 = 'M';
            break;
        case 13:
            LX100 = 'N';
            break;
        case 14:
            LX100 = 'P';
            break;
        case 15:
            LX100 = 'Q';
            break;
        case 16:
            LX100 = 'R';
            break;
        case 17:
            LX100 = 'S';
            break;
        case 18:
            LX100 = 'T';
            break;
        case 19:
            LX100 = 'U';
            break;
        case 20:
            LX100 = 'V';
            break;
        case 21:
            LX100 = 'W';
            break;
        case 22:
            LX100 = 'X';
            break;
        case 23:
            LX100 = 'Y';
            break;
        case 24:
            LX100 = 'Z';
            break;
    }


    if ((this.GridZoneL - Math.floor(this.GridZoneL / 2) * 2) == 0) { y100 = y100 + 5; }	//Se Artia Zoni, metathesi tou deyteroy xaraktira
    if (y100 > 20) { y100 = y100 - 20; }												//Oi xaraktires gia Y epanalambanontai. Arameta ton 20 epistrefo

    switch (y100) {
        case 1:
            LY100 = 'A';
            break;
        case 2:
            LY100 = 'B';
            break;
        case 3:
            LY100 = 'C';
            break;
        case 4:
            LY100 = 'D';
            break;
        case 5:
            LY100 = 'E';
            break;
        case 6:
            LY100 = 'F';
            break;
        case 7:
            LY100 = 'G';
            break;
        case 8:
            LY100 = 'H';
            break;
        case 9:
            LY100 = 'J';
            break;
        case 10:
            LY100 = 'K';
            break;
        case 11:
            LY100 = 'L';
            break;
        case 12:
            LY100 = 'M';
            break;
        case 13:
            LY100 = 'N';
            break;
        case 14:
            LY100 = 'P';
            break;
        case 15:
            LY100 = 'Q';
            break;
        case 16:
            LY100 = 'R';
            break;
        case 17:
            LY100 = 'S';
            break;
        case 18:
            LY100 = 'T';
            break;
        case 19:
            LY100 = 'U';
            break;
        case 20:
            LY100 = 'V';
            break;
    }


    xxxx = XX - Math.floor((XX) / 100000) * 100000;
    yyyy = YY - Math.floor((YY) / 100000) * 100000;

    xxxx = Math.round(xxxx);
    yyyy = Math.round(yyyy);

    var out = new Array();
    out[1] = this.GridZone;	//Zone + Band

    //100km Suare
    out[2] = LX100;
    out[3] = LY100;

    out[4] = xxxx;	//MGRS X
    out[5] = yyyy;	//MGRS Y

    out[6] = XX;	//UTM X
    out[7] = YY;	//UTM Y

    out[8] = this.GridZoneF;
    out[9] = this.GridZoneL;

    return out;
}


function fl2MGRS(f, l) {
    //lng 		+-180 mode
    //get lng 	0-360 mode
    var lt = l + 180;

    //get zone
    this.GridZoneL = Math.floor(lt / 6) + 1;

    //get f from -80  
    var ft = f + 80;
    ft = Math.floor(ft / 8) + 1;

    //Zone Band
    switch (ft) {
        case 1:
            this.GridZoneF = 'C';
            break;
        case 2:
            this.GridZoneF = 'D';
            break;
        case 3:
            this.GridZoneF = 'E';
            break;
        case 4:
            this.GridZoneF = 'F';
            break;
        case 5:
            this.GridZoneF = 'G';
            break;
        case 6:
            this.GridZoneF = 'H';
            break;
        case 7:
            this.GridZoneF = 'J';
            break;
        case 8:
            this.GridZoneF = 'K';
            break;
        case 9:
            this.GridZoneF = 'L';
            break;
        case 10:
            this.GridZoneF = 'M';
            break;
        case 11:
            this.GridZoneF = 'N';
            break;
        case 12:
            this.GridZoneF = 'P';
            break;
        case 13:
            this.GridZoneF = 'Q';
            break;
        case 14:
            this.GridZoneF = 'R';
            break;
        case 15:
            this.GridZoneF = 'S';
            break;
        case 16:
            this.GridZoneF = 'T';
            break;
        case 17:
            this.GridZoneF = 'U';
            break;
        case 18:
            this.GridZoneF = 'V';
            break;
        case 19:
            this.GridZoneF = 'W';
            break;
        case 20:
            this.GridZoneF = 'X';
            break;
        case 21:
            ft = 20;
            this.GridZoneF = 'C';
            break;
    }

    this.GridZone = this.GridZoneL + this.GridZoneF;

    var Fo = 0;
    var Lo = this.GridZoneL * 6 - 3;
    var w = 6;
    Lo = Lo - 180;
    var k0 = 0.9996;

    Fo = Fo * pi / 180;
    Lo = Lo * pi / 180;
    f = f * pi / 180;
    l = l * pi / 180;

    var e = wgs84_e;
    var a = wgs84_a;

    var pT = Math.tan(f) * Math.tan(f);
    var pC = (Math.pow(e, 2)) * (Math.pow(Math.cos(f), 2)) / (1 - Math.pow(e, 2));
    var pA = (l - Lo) * Math.cos(f);
    var pn = a / Math.sqrt(1 - (e * e) * (Math.sin(f) * Math.sin(f)));

    var pM = (1 - Math.pow(e, 2) / 4 - 3 * Math.pow(e, 4) / 64 - 5 * Math.pow(e, 6) / 256) * f;
    pM = pM - (3 * Math.pow(e, 2) / 8 + 3 * Math.pow(e, 4) / 32 + 45 * Math.pow(e, 6) / 1024) * Math.sin(2 * f);
    pM = pM + (15 * Math.pow(e, 4) / 256 + 45 * Math.pow(e, 6) / 1024) * Math.sin(4 * f);
    pM = pM - (35 * Math.pow(e, 6) / 3072) * Math.sin(6 * f);
    pM = pM * a;


    pM0 = (1 - Math.pow(e, 2) / 4 - 3 * Math.pow(e, 4) / 64 - 5 * Math.pow(e, 6) / 256) * Fo;
    pM0 = pM0 - (3 * Math.pow(e, 2) / 8 + 3 * Math.pow(e, 4) / 32 + 45 * Math.pow(e, 6) / 1024) * Math.sin(2 * Fo);
    pM0 = pM0 + (15 * Math.pow(e, 4) / 256 + 45 * Math.pow(e, 6) / 1024) * Math.sin(4 * Fo);
    pM0 = pM0 - (35 * Math.pow(e, 6) / 3072) * Math.sin(6 * Fo);
    pM0 = pM0 * a;


    var et = Math.sqrt(e * e / (1 - e * e));

    //Compute UTM X
    //Ypologismos UTM X
    var XX = 500000 + k0 * pn * (pA + (1 - pT + pC) * pA * pA * pA / 6 + (5 - 18 * pT + pT * pT + 72 * pC - 58 * et * et) * pA * pA * pA * pA * pA / 120);

    //Compute UTM Y
    //Ypologismos UTM Y
    var YY = pA * pA / 2;
    YY = YY + (5 - pT + 9 * pC + 4 * pC * pC) * pA * pA * pA * pA / 24;
    YY = YY + (61 - 58 * pT + pT * pT + 600 * pC - 330 * et * et) * Math.pow(pA, 6) / 720;
    YY = YY * pn * Math.tan(f);
    YY = YY + pM - pM0;
    YY = YY * k0;
    YY = YY;

    //Y offset for South Hemisphere
    if (f < 0) { YY = YY + 10000000; }


    z100x = Math.floor((XX) / 100000);
    z100y = Math.floor((YY) / 100000);

    var x100;
    x100 = ((this.GridZoneL - (Math.floor(this.GridZoneL / 3) * 3)) - 1) * 8 + z100x;
    if (x100 < 0) { x100 = x100 + 24; };
    var y100;
    y100 = z100y - Math.floor(z100y / 20) * 20 + 1;

    var LX100;
    var LY100;

    switch (x100) {
        case 1:
            LX100 = 'A';
            break;
        case 2:
            LX100 = 'B';
            break;
        case 3:
            LX100 = 'C';
            break;
        case 4:
            LX100 = 'D';
            break;
        case 5:
            LX100 = 'E';
            break;
        case 6:
            LX100 = 'F';
            break;
        case 7:
            LX100 = 'G';
            break;
        case 8:
            LX100 = 'H';
            break;
        case 9:
            LX100 = 'J';
            break;
        case 10:
            LX100 = 'K';
            break;
        case 11:
            LX100 = 'L';
            break;
        case 12:
            LX100 = 'M';
            break;
        case 13:
            LX100 = 'N';
            break;
        case 14:
            LX100 = 'P';
            break;
        case 15:
            LX100 = 'Q';
            break;
        case 16:
            LX100 = 'R';
            break;
        case 17:
            LX100 = 'S';
            break;
        case 18:
            LX100 = 'T';
            break;
        case 19:
            LX100 = 'U';
            break;
        case 20:
            LX100 = 'V';
            break;
        case 21:
            LX100 = 'W';
            break;
        case 22:
            LX100 = 'X';
            break;
        case 23:
            LX100 = 'Y';
            break;
        case 24:
            LX100 = 'Z';
            break;
    }


    if ((this.GridZoneL - Math.floor(this.GridZoneL / 2) * 2) == 0) { y100 = y100 + 5; }
    if (y100 > 20) { y100 = y100 - 20; }

    switch (y100) {
        case 1:
            LY100 = 'A';
            break;
        case 2:
            LY100 = 'B';
            break;
        case 3:
            LY100 = 'C';
            break;
        case 4:
            LY100 = 'D';
            break;
        case 5:
            LY100 = 'E';
            break;
        case 6:
            LY100 = 'F';
            break;
        case 7:
            LY100 = 'G';
            break;
        case 8:
            LY100 = 'H';
            break;
        case 9:
            LY100 = 'J';
            break;
        case 10:
            LY100 = 'K';
            break;
        case 11:
            LY100 = 'L';
            break;
        case 12:
            LY100 = 'M';
            break;
        case 13:
            LY100 = 'N';
            break;
        case 14:
            LY100 = 'P';
            break;
        case 15:
            LY100 = 'Q';
            break;
        case 16:
            LY100 = 'R';
            break;
        case 17:
            LY100 = 'S';
            break;
        case 18:
            LY100 = 'T';
            break;
        case 19:
            LY100 = 'U';
            break;
        case 20:
            LY100 = 'V';
            break;
    }


    xxxx = XX - Math.floor((XX) / 100000) * 100000;
    yyyy = YY - Math.floor((YY) / 100000) * 100000;
    xxxx = Math.round(xxxx);
    yyyy = Math.round(yyyy);

    var out = new Array();

    var out = new Array();
    out[1] = this.GridZone;	//Zone + Band

    //100km Suare
    out[2] = LX100;
    out[3] = LY100;

    out[4] = xxxx;	//MGRS X
    out[5] = yyyy;	//MGRS Y

    out[6] = XX;	//UTM X
    out[7] = YY;	//UTM Y

    out[8] = this.GridZoneF;
    out[9] = this.GridZoneL;

    return out;
}


function fl2EGSA87(f, l) {

    var par = Math.sqrt(1 - (eg_e * eg_e * Math.sin(f * pi / 180) * Math.sin(f * pi / 180)));
    var n = eg_a / (Math.sqrt(1 - (eg_e * eg_e * Math.sin(f * pi / 180) * Math.sin(f * pi / 180))));

    var h = 0;
    var W_x = (n + h) * Math.cos(f * pi / 180) * Math.cos(l * pi / 180);
    var W_y = (n + h) * Math.cos(f * pi / 180) * Math.sin(l * pi / 180);
    var W_z = (n * (1 - eg_e * eg_e) + h) * Math.sin(f * pi / 180);

    var dx = 199.723;
    var dy = -74.03;
    var dz = -246.018;

    var E_x = W_x + dx;
    var E_y = W_y + dy;
    var E_z = W_z + dz;

    var E_mik = Math.atan(E_y / E_x) * 180 / pi;

    var F0 = Math.atan(E_z / ((1 - eg_e * eg_e) * Math.sqrt(E_x * E_x + E_y * E_y)));
    var f1 = Math.atan((E_z + eg_e * eg_e * (eg_a / par) * Math.sin(F0)) / (Math.sqrt(E_x * E_x + E_y * E_y)));

    while (Math.abs(F0 - f1) > 0.000000001 * pi / 180) {
        F0 = f1;
        f1 = Math.atan((E_z + eg_e * eg_e * (eg_a / par) * Math.sin(F0)) / (Math.sqrt(E_x * E_x + E_y * E_y)));
    }

    var E_plat = f1 * 180 / pi;


    l = E_mik * pi / 180;
    f = E_plat * pi / 180;

    n = eg_a / (Math.sqrt(1 - (eg_e * eg_e * Math.sin(f) * Math.sin(f))));
    var e2 = eg_e * eg_e;
    var e4 = e2 * e2;
    var e6 = e2 * e2 * e2;
    var e8 = e2 * e2 * e2 * e2;


    var M0 = 1 + 3 * e2 / 4 + 45 * e4 / 64 + 175 * e6 / 256 + 11025 * e8 / 16384;
    var m2 = 3 * e2 / 8 + 15 * e4 / 32 + 525 * e6 / 1024 + 2205 * e8 / 4096;
    var M4 = 15 * e4 / 256 + 105 * e6 / 1024 + 2205 * e8 / 8820;
    var M6 = 35 * e6 / 3072 + 315 * e8 / 12288;
    var M8 = 315 * e8 / 130784;

    var m = eg_a * (1 - e2) * (M0 * f - m2 * Math.sin(2 * f) + M4 * Math.sin(4 * f) - M6 * Math.sin(6 * f) + M8 * Math.sin(8 * f));

    var k0 = 0.9996;
    var L0 = 24 * pi / 180;

    var et = eg_e;

    var cosf = Math.cos(f); var tanf = Math.tan(f);
    var dl = l - L0;
    l = dl * cosf;

    var n2 = et * et * cosf * cosf / (1 - et * et)
    var t = tanf;
    var x = (((5 - 18 * t * t + t * t * t * t + 14 * n2 - 58 * t * t * n2) * l * l / 120 + (1 - t * t + n2) / 6) * l * l + 1) * l * k0 * n + 500000;
    var y = m + (n * t / 2) * l * l + (n * t / 24) * (5 - t * t + 9 * n2 + 4 * n2 * n2) * l * l * l * l + (n * t / 720) * (61 - 58 * t * t) * l * l * l * l * l * l;
    y = y * k0;

    var out = new Array();
    out[0] = x;
    out[1] = y;
    return out;

}

//Remove Large Grid
function kanRemove() {
    kanPut = false;
    for (i = 1; i <= kanN; i++) {
        kan[i].setMap(null);
    }
    kanN = 0;
}



//Remove Small Grid
function lkanRemove() {
    lkanPut = false;
    for (i = 1; i <= lkanN; i++) {

        lkan[i].setMap(null);
    }
    lkanN = 0;
}



//UTM Zone Grid WGS 84
function kanavos() {

    var ar1;
    var ar2;
    var coors;


    //  Zones
    ////////////////////////////////////////////////////////////////////////////////
    for (i = 32; i <= 50; i = i + 8) {
        ar1 = new google.maps.LatLng(i, 10);
        ar2 = new google.maps.LatLng(i, 40);
        coors = [ar1, ar2];	//,ar1,belos2,ar2];

        kanN += 1;
        kan[kanN] = new google.maps.Polyline({
            path: coors,
            strokeColor: "#d00",
            strokeOpacity: 1,
            strokeWeight: 2
        });
        kan[kanN].setMap(map);
    }

    /////////////////////////////////////////////////////////////////////////////////






    for (i = 33; i <= 37; i++) {

        a = UTM_xy2fl(500000, 0, i, 0);

        f0 = Math.round(a[1]);
        f1 = f0 - 3;
        f2 = f0 + 3;

        ar1 = new google.maps.LatLng(31, f1);
        ar2 = new google.maps.LatLng(49, f1);
        coors = [ar1, ar2];

        kanN += 1;
        kan[kanN] = new google.maps.Polyline({
            path: coors,
            strokeColor: "#d00",
            strokeOpacity: 1,
            strokeWeight: 2
        });
        kan[kanN].setMap(map);

    }


    kanPut = true;
}



//UTM Zone Grid ED 50
function kanavosED50() {

    var ar1;
    var ar2;
    var coors;




    //  Zones
    ////////////////////////////////////////////////////////////////////////////////
    for (i = 32; i <= 50; i = i + 8) {
        var bb1 = fled50towgs84(i, 10, 0);
        var bb2 = fled50towgs84(i, 40, 0);
        ar1 = new google.maps.LatLng(bb1[0], bb1[1]);
        ar2 = new google.maps.LatLng(bb2[0], bb2[1]);

        coors = [ar1, ar2];	//,ar1,belos2,ar2];

        kanN += 1;
        kan[kanN] = new google.maps.Polyline({
            path: coors,
            strokeColor: "#d00",
            strokeOpacity: 1,
            strokeWeight: 2
        });
        kan[kanN].setMap(map);
    }


    /////////////////////////////////////////////////////////////////////////////////






    for (i = 33; i <= 37; i++) {

        a = ED50_xy2fl(500000, 0, i, 0);

        f0 = Math.round(a[1]);
        f1 = f0 - 3;
        f2 = f0 + 3;







        var aa1 = fled50towgs84(31, f1, 0);
        var aa2 = fled50towgs84(49, f1, 0);

        ar1 = new google.maps.LatLng(aa1[0], aa1[1]);
        ar2 = new google.maps.LatLng(aa2[0], aa2[1]);

        coors = [ar1, ar2];


        kanN += 1;
        kan[kanN] = new google.maps.Polyline({
            path: coors,
            strokeColor: "#d00",
            strokeOpacity: 1,
            strokeWeight: 2
        });
        kan[kanN].setMap(map);
    }

    kanPut = true;
}



//Zet UTM Zone
function getZone(l) {

    var lt = l + 180;
    var out = Math.floor(lt / 6) + 1;

    return out;
}



//Get Zone L0
function getZoneL0(z) {

    var lt = (z - 1) * 6 - 180 + 3;
    return lt;
}



//100km Grid WGS 84 - Create
function zonekan(z) {


    var c = curlatLng;
    c0 = c.lng();
    d0 = c.lat();

    var UTM = fl2MGRS(d0, c0);

    x0 = UTM[6];
    y0 = UTM[7];


    x0 = Math.round(x0 / 100000);
    y0 = Math.round(y0 / 100000);



    for (i = y0 - 5; i <= y0 + 5; i++) {

        for (j = -7; j <= +7; j++) {

            var a1 = UTM_xy2fl(j * 100000, i * 100000, z, 0);
            var a2 = UTM_xy2fl(j * 100000 + 100000, i * 100000, z, 0);
            var a3 = UTM_xy2fl(j * 100000, i * 100000 + 100000, z, 0);
            var a4 = UTM_xy2fl(j * 100000 + 100000, i * 100000 + 100000, z, 0);

            if (getZoneL0(z) - 3 <= Math.floor(a1[1]) && getZoneL0(z) + 3 >= Math.floor(a2[1]) + 1) {

                ar1 = new google.maps.LatLng(a1[0], a1[1]);
                ar2 = new google.maps.LatLng(a2[0], a2[1]);
                ar3 = new google.maps.LatLng(a3[0], a3[1]);
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4];	//,ar1,belos2,ar2];


                kanN += 1;
                kan[kanN] = new google.maps.Polyline({
                    path: coors,
                    strokeColor: "#d0d",
                    strokeOpacity: 1,
                    strokeWeight: 1
                });
                kan[kanN].setMap(map);

            }
            else if (getZoneL0(z) + 3 < Math.floor(a2[1]) + 1 && getZoneL0(z) + 3 > Math.floor(a1[1])) {


                var s1 = dist00(new google.maps.LatLng(a1[0], a1[1]), new google.maps.LatLng(a2[0], a2[1]));
                var s2 = dist00(new google.maps.LatLng(a1[0], a1[1]), new google.maps.LatLng(a2[0], getZoneL0(z) + 3));

                var dx = 100000 * s2 / s1;
                var a2 = UTM_xy2fl(j * 100000 + dx, i * 100000, z, 0);
                a2[1] = getZoneL0(z) + 3;

                var s1 = dist00(new google.maps.LatLng(a4[0], a4[1]), new google.maps.LatLng(a3[0], a3[1]));
                var s2 = dist00(new google.maps.LatLng(a3[0], a3[1]), new google.maps.LatLng(a4[0], getZoneL0(z) + 3));

                var dx = 100000 * s2 / s1;
                var a4 = UTM_xy2fl(j * 100000 + dx + 100000, i * 100000 + 100000, z, 0);
                a4[1] = getZoneL0(z) + 3;

                ar1 = new google.maps.LatLng(a1[0], a1[1]);
                ar2 = new google.maps.LatLng(a2[0], a2[1]);
                ar3 = new google.maps.LatLng(a3[0], a3[1]);
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4];	//,ar1,belos2,ar2];



                kanN += 1;
                kan[kanN] = new google.maps.Polyline({
                    path: coors,
                    strokeColor: "#d0d",
                    strokeOpacity: 1,
                    strokeWeight: 1
                });
                kan[kanN].setMap(map);

            }
            else if (getZoneL0(z) - 3 > Math.floor(a1[1]) && getZoneL0(z) - 3 < Math.floor(a2[1]) + 1) {

                var s1 = dist00(new google.maps.LatLng(a1[0], a1[1]), new google.maps.LatLng(a2[0], a2[1]));
                var s2 = dist00(new google.maps.LatLng(a1[0], a1[1]), new google.maps.LatLng(a2[0], getZoneL0(z) - 3));

                var dx = 100000 * s2 / s1;
                var a1 = UTM_xy2fl(j * 100000 + dx, i * 100000, z, 0);
                a1[1] = getZoneL0(z) - 3;

                var s1 = dist00(new google.maps.LatLng(a4[0], a4[1]), new google.maps.LatLng(a3[0], a3[1]));
                var s2 = dist00(new google.maps.LatLng(a3[0], a3[1]), new google.maps.LatLng(a4[0], getZoneL0(z) - 3));

                var dx = 100000 * s2 / s1;
                var a3 = UTM_xy2fl(j * 100000 + dx, i * 100000 + 100000, z, 0);
                a3[1] = getZoneL0(z) - 3;

                ar1 = new google.maps.LatLng(a1[0], a1[1]);
                ar2 = new google.maps.LatLng(a2[0], a2[1]);
                ar3 = new google.maps.LatLng(a3[0], a3[1]);
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4];	//,ar1,belos2,ar2];

                kanN += 1;
                kan[kanN] = new google.maps.Polyline({
                    path: coors,
                    strokeColor: "#d0d",
                    strokeOpacity: 1,
                    strokeWeight: 1
                });
                kan[kanN].setMap(map);

            }
        }
    }

}



//100km Grid ED50 - Create
function zonekanED50(z) {

    var c = curlatLng;
    c0 = c.lng();
    d0 = c.lat();

    var UTM = fl2MGRS(d0, c0);

    x0 = UTM[6];
    y0 = UTM[7];


    x0 = Math.round(x0 / 100000);
    y0 = Math.round(y0 / 100000);



    for (i = y0 - 5; i <= y0 + 5; i++) {

        for (j = -7; j <= +7; j++) {

            var a1 = ED50_xy2fl(j * 100000, i * 100000, z, 0);
            a1 = fled50towgs84(a1[0], a1[1], 0);
            var a2 = ED50_xy2fl(j * 100000 + 100000, i * 100000, z, 0);
            a2 = fled50towgs84(a2[0], a2[1], 0);
            var a3 = ED50_xy2fl(j * 100000, i * 100000 + 100000, z, 0);
            a3 = fled50towgs84(a3[0], a3[1], 0);
            var a4 = ED50_xy2fl(j * 100000 + 100000, i * 100000 + 100000, z, 0);
            a4 = fled50towgs84(a4[0], a4[1], 0);

            if (getZoneL0(z) - 3 <= Math.floor(a1[1]) && getZoneL0(z) + 3 >= Math.floor(a2[1]) + 1) {

                ar1 = new google.maps.LatLng(a1[0], a1[1]);
                ar2 = new google.maps.LatLng(a2[0], a2[1]);
                ar3 = new google.maps.LatLng(a3[0], a3[1]);
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4];

                kanN += 1;
                kan[kanN] = new google.maps.Polyline({
                    path: coors,
                    strokeColor: "#d0d",
                    strokeOpacity: 1,
                    strokeWeight: 1
                });
                kan[kanN].setMap(map);

            }
            else if (getZoneL0(z) + 3 < Math.floor(a2[1]) + 1 && getZoneL0(z) + 3 > Math.floor(a1[1])) {

                var s1 = dist00(new google.maps.LatLng(a1[0], a1[1]), new google.maps.LatLng(a2[0], a2[1]));
                var s2 = dist00(new google.maps.LatLng(a1[0], a1[1]), new google.maps.LatLng(a2[0], getZoneL0(z) + 3));

                var dx = 100000 * s2 / s1;
                var a2 = ED50_xy2fl(j * 100000 + dx, i * 100000, z, 0);
                a2[1] = getZoneL0(z) + 3;
                a2 = fled50towgs84(a2[0], a2[1], 0);

                var s1 = dist00(new google.maps.LatLng(a4[0], a4[1]), new google.maps.LatLng(a3[0], a3[1]));
                var s2 = dist00(new google.maps.LatLng(a3[0], a3[1]), new google.maps.LatLng(a4[0], getZoneL0(z) + 3));

                var dx = 100000 * s2 / s1;
                var a4 = ED50_xy2fl(j * 100000 + dx + 100000, i * 100000 + 100000, z, 0);
                a4[1] = getZoneL0(z) + 3;
                a4 = fled50towgs84(a4[0], a4[1], 0);


                ar1 = new google.maps.LatLng(a1[0], a1[1]);
                ar2 = new google.maps.LatLng(a2[0], a2[1]);
                ar3 = new google.maps.LatLng(a3[0], a3[1]);
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4];

                kanN += 1;
                kan[kanN] = new google.maps.Polyline({
                    path: coors,
                    strokeColor: "#d0d",
                    strokeOpacity: 1,
                    strokeWeight: 1
                });
                kan[kanN].setMap(map);

            }
            else if (getZoneL0(z) - 3 > Math.floor(a1[1]) && getZoneL0(z) - 3 < Math.floor(a2[1]) + 1) {

                var s1 = dist00(new google.maps.LatLng(a1[0], a1[1]), new google.maps.LatLng(a2[0], a2[1]));
                var s2 = dist00(new google.maps.LatLng(a1[0], a1[1]), new google.maps.LatLng(a2[0], getZoneL0(z) - 3));

                var dx = 100000 * s2 / s1;
                var a1 = ED50_xy2fl(j * 100000 + dx, i * 100000, z, 0);
                a1[1] = getZoneL0(z) - 3;
                a1 = fled50towgs84(a1[0], a1[1], 0);

                var s1 = dist00(new google.maps.LatLng(a4[0], a4[1]), new google.maps.LatLng(a3[0], a3[1]));
                var s2 = dist00(new google.maps.LatLng(a3[0], a3[1]), new google.maps.LatLng(a4[0], getZoneL0(z) - 3));

                var dx = 100000 * s2 / s1;
                var a3 = ED50_xy2fl(j * 100000 + dx, i * 100000 + 100000, z, 0);
                a3[1] = getZoneL0(z) - 3;
                a3 = fled50towgs84(a3[0], a3[1], 0);



                ar1 = new google.maps.LatLng(a1[0], a1[1]);
                ar2 = new google.maps.LatLng(a2[0], a2[1]);
                ar3 = new google.maps.LatLng(a3[0], a3[1]);
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4];

                kanN += 1;
                kan[kanN] = new google.maps.Polyline({
                    path: coors,
                    strokeColor: "#d0d",
                    strokeOpacity: 1,
                    strokeWeight: 1
                });
                kan[kanN].setMap(map);

            }
        }
    }
}



//Triger 100km Grid WGS 84
function mkan() {

    var c = curlatLng;
    c0 = c.lng();
    d0 = c.lat();

    var z = getZone(c0);
    var UTM = fl2MGRS(d0, c0);

    x0 = UTM[6];
    y0 = UTM[7];


    x0 = Math.round(x0 / 100000);
    y0 = Math.round(y0 / 100000);

    var z2;
    if (getZoneL0(getZone(c0)) > c0) { z2 = z - +1; } else { z2 = z + 1 }
    zonekan(z2);
    zonekan(z);

    kanPut = true;

}




//Triger 100km Grid ED50
function mkanED50() {

    var c = curlatLng;
    c0 = c.lng();
    d0 = c.lat();

    var z = getZone(c0);
    var UTM = fl2MGRS(d0, c0);

    x0 = UTM[6];
    y0 = UTM[7];


    x0 = Math.round(x0 / 100000);
    y0 = Math.round(y0 / 100000);

    var z2;
    if (getZoneL0(getZone(c0)) > c0) { z2 = z - +1; } else { z2 = z + 1 }
    zonekanED50(z2);
    zonekanED50(z);

    kanPut = true;
}



//1000m Grid WGS 84 - Create
function kan100() {

    var c = curlatLng;
    c0 = c.lng();
    d0 = c.lat();
    var UTM = fl2MGRS(d0, c0);

    x0 = UTM[6];
    y0 = UTM[7];


    x0 = Math.round(x0 / 1000);
    y0 = Math.round(y0 / 1000);

    for (i = y0 - 5; i <= y0 + 5; i++) {

        for (j = x0 - 5; j <= x0 + 5; j++) {

            var a1 = UTM_xy2fl(j * 1000, i * 1000, getZone(c0), 0);
            var a2 = UTM_xy2fl(j * 1000 + 1000, i * 1000, getZone(c0), 0);
            var a3 = UTM_xy2fl(j * 1000, i * 1000 + 1000, getZone(c0), 0);
            var a4 = UTM_xy2fl(j * 1000 + 1000, i * 1000 + 1000, getZone(c0), 0);

            ar1 = new google.maps.LatLng(a1[0], a1[1]);
            ar2 = new google.maps.LatLng(a2[0], a2[1]);
            ar3 = new google.maps.LatLng(a3[0], a3[1]);


            if (j == x0 + 5) {
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4, ar3];
            } else if (i == y0 + 5) {
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4, ar3];
            } else {
                coors = [ar3, ar1, ar2];
            }

            lkanN += 1;
            lkan[lkanN] = new google.maps.Polyline({
                path: coors,
                strokeColor: "#d0d",
                strokeOpacity: 1,
                strokeWeight: 1
            });
            lkan[lkanN].setMap(map);
        }
    }
    lkanPut = true;
}




//1000m Grid WGS 84 - Create
function kan100ED50() {

    var c = curlatLng;
    c0 = c.lng();
    d0 = c.lat();
    var UTM = fl2EDMGRS(d0, c0);

    x0 = UTM[6];
    y0 = UTM[7];


    x0 = Math.round(x0 / 1000);
    y0 = Math.round(y0 / 1000);


    for (i = y0 - 5; i <= y0 + 5; i++) {

        for (j = x0 - 5; j <= x0 + 5; j++) {

            var a1 = ED50_xy2fl(j * 1000, i * 1000, getZone(c0), 0);
            a1 = fled50towgs84(a1[0], a1[1], 0);
            var a2 = ED50_xy2fl(j * 1000 + 1000, i * 1000, getZone(c0), 0);
            a2 = fled50towgs84(a2[0], a2[1], 0);
            var a3 = ED50_xy2fl(j * 1000, i * 1000 + 1000, getZone(c0), 0);
            a3 = fled50towgs84(a3[0], a3[1], 0);
            var a4 = ED50_xy2fl(j * 1000 + 1000, i * 1000 + 1000, getZone(c0), 0);
            a4 = fled50towgs84(a4[0], a4[1], 0);

            ar1 = new google.maps.LatLng(a1[0], a1[1]);
            ar2 = new google.maps.LatLng(a2[0], a2[1]);
            ar3 = new google.maps.LatLng(a3[0], a3[1]);


            if (j == x0 + 5) {
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4, ar3];
            } else if (i == y0 + 5) {
                ar4 = new google.maps.LatLng(a4[0], a4[1]);
                coors = [ar3, ar1, ar2, ar4, ar3];
            } else {
                coors = [ar3, ar1, ar2];
            }


            lkanN += 1;
            lkan[lkanN] = new google.maps.Polyline({
                path: coors,
                strokeColor: "#d0d",
                strokeOpacity: 1,
                strokeWeight: 1
            });

            lkan[lkanN].setMap(map);
        }
    }
    lkanPut = true;
}



// Output WGS 84  lat, lng
function UTM_xy2fl(XX, YY, z, Hemisphere) {

    if (Hemisphere == 1) { YY = YY - 10000000; }


    Out = new Array();


    var FE;        //False Easting
    var FN;        //False Northing
    var k0;     	//Scale
    var F0;
    var l1;
    var W;
    var L0;


    FE = 500000;
    FN = 0;
    k0 = 0.9996;
    F0 = 0 * pi / 180;
    l1 = -180 * pi / 180;
    W = 6 * pi / 180;


    var LastZone = z;
    L0 = z * W - (-l1 + W / 2);

    while (L0 > 180 * 4 * Math.atan(1) / 180) {
        L0 = L0 - 360 * 4 * Math.atan(1) / 180;
    }



    while (L0 < -180 * 4 * Math.atan(1) / 180) {
        L0 = L0 + 360 * 4 * Math.atan(1) / 180;
    }


    var ee;
    ee = wgs84_e;
    var et;
    et = Math.sqrt(ee * ee / (1 - ee * ee));
    var aa;
    aa = wgs84_a;


    var pM0;


    pM0 = (1 - Math.pow(ee, 2) / 4 - 3 * Math.pow(ee, 4) / 64 - 5 * Math.pow(ee, 6) / 256) * F0;
    pM0 = pM0 - (3 * Math.pow(ee, 2) / 8 + 3 * Math.pow(ee, 4) / 32 + 45 * Math.pow(ee, 6) / 1024) * Math.sin(2 * F0);
    pM0 = pM0 + (15 * Math.pow(ee, 4) / 256 + 45 * Math.pow(ee, 6) / 1024) * Math.sin(4 * F0);
    pM0 = pM0 - (35 * Math.pow(ee, 6) / 3072) * Math.sin(6 * F0);
    pM0 = pM0 * aa;

    var pe1;
    var pm1;
    var pMm1;
    var pT1;
    var pC1;
    var pD;

    pe1 = (1 - Math.sqrt((1 - ee * ee))) / (1 + Math.sqrt((1 - ee * ee)));
    pMm1 = pM0 + (YY - FN) / k0;
    pm1 = pMm1 / (aa * (1 - Math.pow(ee, 2) / 4 - 3 * Math.pow(ee, 4) / 64 - 5 * Math.pow(ee, 6) / 256));

    var f1;
    f1 = (3 * pe1 / 2 - 27 * pe1 * pe1 * pe1 / 32) * Math.sin(2 * pm1);

    f1 = f1 + (21 * pe1 * pe1 / 16 - 55 * pe1 * pe1 * pe1 * pe1 / 32) * Math.sin(4 * pm1);
    f1 = f1 + (151 * pe1 * pe1 * pe1 / 96) * Math.sin(6 * pm1);
    f1 = f1 + (1097 * pe1 * pe1 * pe1 * pe1 / 512) * Math.sin(8 * pm1);
    f1 = f1 + pm1;

    pT1 = Math.tan(f1) * Math.tan(f1);
    pC1 = et * et * Math.cos(f1) * Math.cos(f1);

    var pn1;
    var pr1;

    pn1 = aa / Math.sqrt(1 - ee * ee * Math.sin(f1) * Math.sin(f1));
    pr1 = aa * (1 - ee * ee) / Math.sqrt(Math.pow((1 - ee * ee * Math.sin(f1) * Math.sin(f1)), 3));
    pD = (XX - (FE)) / (pn1 * k0);



    var f;
    var l;

    f = pD * pD / 2;
    f = f - (5 + 3 * pT1 + 10 * pC1 - 4 * pC1 * pC1 - 9 * et * et) * pD * pD * pD * pD / 24;
    f = f + (61 + 90 * pT1 + 298 * pC1 + 45 * pT1 * pT1 - 252 * et * et - 3 * pC1 * pC1) * pD * pD * pD * pD * pD * pD / 720;
    f = -(pn1 * Math.tan(f1) / pr1) * f;
    f = f1 + f;

    l = pD;
    l = l - (1 + 2 * pT1 + pC1) * pD * pD * pD / 6;
    l = l + (5 - 2 * pC1 + 28 * pT1 - 3 * pC1 * pC1 + 8 * et * et + 24 * pT1 * pT1) * pD * pD * pD * pD * pD / 120;
    l = l / Math.cos(f1);
    l = l + L0;


    Out[0] = f * 180 / pi;
    Out[1] = l * 180 / pi;

    return Out;

}



// Output WGS 84  lat, lng
function ED50_xy2fl(XX, YY, z, Hemisphere) {

    if (Hemisphere == 1) { YY = YY - 10000000; }


    Out = new Array();


    var FE;        //False Easting
    var FN;        //False Northing
    var k0;     	//Scale
    var F0;
    var l1;
    var W;
    var L0;

    //Set_UTM_Params 0, -180, 6, 0.9996, 500000, 0

    FE = 500000;
    FN = 0;
    k0 = 0.9996;
    F0 = 0 * pi / 180;
    l1 = -180 * pi / 180;
    W = 6 * pi / 180;


    var LastZone = z;
    L0 = z * W - (-l1 + W / 2);

    while (L0 > 180 * 4 * Math.atan(1) / 180) {
        L0 = L0 - 360 * 4 * Math.atan(1) / 180;
    }



    while (L0 < -180 * 4 * Math.atan(1) / 180) {
        L0 = L0 + 360 * 4 * Math.atan(1) / 180;
    }


    var ee;
    ee = ED_e;
    var et;
    et = Math.sqrt(ee * ee / (1 - ee * ee));
    var aa;
    aa = ED_a;


    var pM0;


    pM0 = (1 - Math.pow(ee, 2) / 4 - 3 * Math.pow(ee, 4) / 64 - 5 * Math.pow(ee, 6) / 256) * F0;
    pM0 = pM0 - (3 * Math.pow(ee, 2) / 8 + 3 * Math.pow(ee, 4) / 32 + 45 * Math.pow(ee, 6) / 1024) * Math.sin(2 * F0);
    pM0 = pM0 + (15 * Math.pow(ee, 4) / 256 + 45 * Math.pow(ee, 6) / 1024) * Math.sin(4 * F0);
    pM0 = pM0 - (35 * Math.pow(ee, 6) / 3072) * Math.sin(6 * F0);
    pM0 = pM0 * aa;




    var pe1;
    var pm1;
    var pMm1;
    var pT1;
    var pC1;
    var pD;



    pe1 = (1 - Math.sqrt((1 - ee * ee))) / (1 + Math.sqrt((1 - ee * ee)));
    pMm1 = pM0 + (YY - FN) / k0;
    pm1 = pMm1 / (aa * (1 - Math.pow(ee, 2) / 4 - 3 * Math.pow(ee, 4) / 64 - 5 * Math.pow(ee, 6) / 256));

    var f1;
    f1 = (3 * pe1 / 2 - 27 * pe1 * pe1 * pe1 / 32) * Math.sin(2 * pm1);
    f1 = f1 + (21 * pe1 * pe1 / 16 - 55 * pe1 * pe1 * pe1 * pe1 / 32) * Math.sin(4 * pm1);
    f1 = f1 + (151 * pe1 * pe1 * pe1 / 96) * Math.sin(6 * pm1);
    f1 = f1 + (1097 * pe1 * pe1 * pe1 * pe1 / 512) * Math.sin(8 * pm1);
    f1 = f1 + pm1;

    pT1 = Math.tan(f1) * Math.tan(f1);
    pC1 = et * et * Math.cos(f1) * Math.cos(f1);

    var pn1;
    var pr1;

    pn1 = aa / Math.sqrt(1 - ee * ee * Math.sin(f1) * Math.sin(f1));
    pr1 = aa * (1 - ee * ee) / Math.sqrt(Math.pow((1 - ee * ee * Math.sin(f1) * Math.sin(f1)), 3));
    pD = (XX - (FE)) / (pn1 * k0);





    var f;
    var l;

    f = pD * pD / 2;
    f = f - (5 + 3 * pT1 + 10 * pC1 - 4 * pC1 * pC1 - 9 * et * et) * pD * pD * pD * pD / 24;
    f = f + (61 + 90 * pT1 + 298 * pC1 + 45 * pT1 * pT1 - 252 * et * et - 3 * pC1 * pC1) * pD * pD * pD * pD * pD * pD / 720;
    f = -(pn1 * Math.tan(f1) / pr1) * f;
    f = f1 + f;

    l = pD;
    l = l - (1 + 2 * pT1 + pC1) * pD * pD * pD / 6;
    l = l + (5 - 2 * pC1 + 28 * pT1 - 3 * pC1 * pC1 + 8 * et * et + 24 * pT1 * pT1) * pD * pD * pD * pD * pD / 120;
    l = l / Math.cos(f1);
    l = l + L0;


    Out[0] = f * 180 / pi;
    Out[1] = l * 180 / pi;


    var Out2 = fled50towgs84(Out[0], Out[1]);
    return Out;
}



function MGRS2UTM(z, t100, x, y) {

    var z1;
    z1 = z.substring(0, 2);
    var z2 = z.substring(2, 3);

    var t1 = t100.substring(0, 1);
    var t2 = t100.substring(1, 2);


    var ft;

    switch (z2) {
        case 'C':
            ft = 1;
            break;
        case 'D':
            ft = 2;
            break;
        case 'E':
            ft = 3;
            break;
        case 'F':
            ft = 4;
            break;
        case 'G':
            ft = 5;
            break;
        case 'H':
            ft = 6;
            break;
        case 'J':
            ft = 7;
            break;
        case 'K':
            ft = 8;
            break;
        case 'L':
            ft = 9;
            break;
        case 'M':
            ft = 10;
            break;
        case 'N':
            ft = 11;
            break;
        case 'P':
            ft = 12;
            break;
        case 'Q':
            ft = 13;
            break;
        case 'R':
            ft = 14;
            break;
        case 'S':
            ft = 15;
            break;
        case 'T':
            ft = 16;
            break;
        case 'U':
            ft = 17;
            break;
        case 'V':
            ft = 18;
            break;
        case 'W':
            ft = 19;
            break;
        case 'X':
            ft = 20;
            break;
    }

    ft = ft - 10;


    var x100;
    var y100;

    switch (t1) {
        case 'A':
            x100 = 1;
            break;
        case 'B':
            x100 = 2;
            break;
        case 'C':
            x100 = 3;
            break;
        case 'D':
            x100 = 4;
            break;
        case 'E':
            x100 = 5;
            break;
        case 'F':
            x100 = 6;
            break;
        case 'G':
            x100 = 7;
            break;
        case 'H':
            x100 = 8;
            break;
        case 'J':
            x100 = 1;
            break;
        case 'K':
            x100 = 2;
            break;
        case 'L':
            x100 = 3;
            break;
        case 'M':
            x100 = 4;
            break;
        case 'N':
            x100 = 5;
            break;
        case 'P':
            x100 = 6;
            break;
        case 'Q':
            x100 = 7;
            break;
        case 'R':
            x100 = 8;
            break;
        case 'S':
            x100 = 1;
            break;
        case 'T':
            x100 = 2;
            break;
        case 'U':
            x100 = 3;
            break;
        case 'V':
            x100 = 4;
            break;
        case 'W':
            x100 = 5;
            break;
        case 'X':
            x100 = 6;
            break;
        case 'Y':
            x100 = 7;
            break;
        case 'Z':
            x100 = 8;
            break;
    }




    switch (t2) {
        case 'A':
            y100 = 1;
            break;
        case 'B':
            y100 = 2;
            break;
        case 'C':
            y100 = 3;
            break;
        case 'D':
            y100 = 4;
            break;
        case 'E':
            y100 = 5;
            break;
        case 'F':
            y100 = 6;
            break;
        case 'G':
            y100 = 7;
            break;
        case 'H':
            y100 = 8;
            break;
        case 'J':
            y100 = 9;
            break;
        case 'K':
            y100 = 10;
            break;
        case 'L':
            y100 = 11;
            break;
        case 'M':
            y100 = 12;
            break;
        case 'N':
            y100 = 13;
            break;
        case 'P':
            y100 = 14;
            break;
        case 'Q':
            y100 = 15;
            break;
        case 'R':
            y100 = 16;
            break;
        case 'S':
            y100 = 17;
            break;
        case 'T':
            y100 = 18;
            break;
        case 'U':
            y100 = 19;
            break;
        case 'V':
            y100 = 20;
            break;
    }


    var z100x = x100 * 100000;

    y100 = y100 - 1;
    if ((z1 - Math.floor(z1 / 2) * 2) == 0) { y100 = y100 - 5; }
    if (y100 < 0) { y100 = y100 + 20; }


    var tempx;
    tempx = z100x + x;
    var tempy;
    var tempy100;

    for (i = 1; i < 10; i++) {
        tempy100 = y100 + (i - 1) * 20;
        tempy = tempy100 * 100000 + y;
        var UTM = UTM_xy2fl(tempx * 1.0, tempy * 1.0, z1 * 1.0, 0.0);
        var UTM2 = fl2MGRS(UTM[0], UTM[1]);
        if (UTM2[8] == z2 && UTM2[9] == z1) { y100 = tempy100; i = 2000; }
    }


    var z100y = y100 * 100000;

    var out = new Array();
    out[0] = z100x + x;
    out[1] = z100y + y;

    return out;
}



//Check if 1st letter of Square is compatible with Zone
function check_zone_letter_1(z, l) {

    var out;
    var x100;

    switch (l) {
        case 'A':
            x100 = 1;
            break;
        case 'B':
            x100 = 1;
            break;
        case 'C':
            x100 = 1;
            break;
        case 'D':
            x100 = 1;
            break;
        case 'E':
            x100 = 1;
            break;
        case 'F':
            x100 = 1;
            break;
        case 'G':
            x100 = 1;
            break;
        case 'H':
            x100 = 1;
            break;
        case 'J':
            x100 = 2;
            break;
        case 'K':
            x100 = 2;
            break;
        case 'L':
            x100 = 2;
            break;
        case 'M':
            x100 = 2;
            break;
        case 'N':
            x100 = 2;
            break;
        case 'P':
            x100 = 2;
            break;
        case 'Q':
            x100 = 2;
            break;
        case 'R':
            x100 = 2;
            break;
        case 'S':
            x100 = 3;
            break;
        case 'T':
            x100 = 3;
            break;
        case 'U':
            x100 = 3;
            break;
        case 'V':
            x100 = 3;
            break;
        case 'W':
            x100 = 3;
            break;
        case 'X':
            x100 = 3;
            break;
        case 'Y':
            x100 = 3;
            break;
        case 'Z':
            x100 = 3;
            break;
    }

    var z2;
    z2 = z - Math.floor((z - 1) / 3) * 3;

    if (z2 == x100) { return true; }
    else { return false; }
}



function Egsa2fl84(x, y) {


    var out = new Array();

    var k0 = 0.9996;


    var F0;
    var dy;
    var df;
    var m;

    var DX;
    DX = x - 500000;

    var L0;
    L0 = 24;

    F0 = 10;
    dy = 10;
    df = 10;

    while (Math.abs(dy) > 0.0000005) {

        var e = eg_e;
        var a = eg_a;

        var M0 = 1 + 3 * Math.pow(e, 2) / 4 + 45 * Math.pow(e, 4) / 64 + 175 * Math.pow(e, 6) / 256 + 11025 * Math.pow(e, 8) / 16384;
        var m2 = 3 * Math.pow(e, 2) / 8 + 15 * Math.pow(e, 4) / 32 + 525 * Math.pow(e, 6) / 1024 + 2205 * Math.pow(e, 8) / 4096;
        var M4 = 15 * Math.pow(e, 4) / 256 + 105 * Math.pow(e, 6) / 1024 + 2205 * Math.pow(e, 8) / 8820;
        var M6 = 35 * Math.pow(e, 6) / 3072 + 315 * Math.pow(e, 8) / 12288;
        var M8 = 315 * Math.pow(e, 8) / 130784;

        var m = a * (1 - Math.pow(e, 2)) * (M0 * F0 * pi / 180 - m2 * Math.sin(2 * F0 * pi / 180) + M4 * Math.sin(4 * F0 * pi / 180) - M6 * Math.sin(6 * F0 * pi / 180) + M8 * Math.sin(8 * F0 * pi / 180));


        if (y / k0 - m > 0) {
            F0 = F0 + df;
        }

        if (y / k0 - m < 0) {
            df = df / 2;
            F0 = F0 - df;
        }

        dy = y / k0 - m;
    }

    F0 = F0;

    var ee;
    ee = eg_e;
    var et;
    et = Math.sqrt(ee * ee / (1 - ee * ee));
    var aa;
    aa = eg_a;
    var bb;
    bb = eg_b;


    var N0;
    N0 = aa / Math.sqrt(1 - ee * ee * Math.sin(F0 * pi / 180) * Math.sin(F0 * pi / 180));

    var p0;
    p0 = aa * (1 - ee * ee) / Math.sqrt(Math.pow((1 - ee * ee * Math.sin(F0 * pi / 180) * Math.sin(F0 * pi / 180)), 3));

    var t0;
    t0 = Math.tan(F0 * pi / 180);



    var nn0;
    nn0 = Math.sqrt(et * et * Math.cos(F0 * pi / 180) * Math.cos(F0 * pi / 180));

    var f;
    var l;



    f = F0 - ((t0 / (2 * k0 * k0 * N0 * p0))) * DX * DX * 180 / pi;
    f = f + ((t0 / (24 * k0 * k0 * k0 * k0 * p0 * N0 * N0 * N0)) * (5 + 3 * t0 * t0 + nn0 * nn0 - 4 * nn0 * nn0 * nn0 * nn0 - 9 * t0 * t0 * nn0 * nn0)) * DX * DX * DX * DX * 180 / pi;
    f = f - ((t0 / (720 * Math.pow(k0, 6) * p0 * Math.pow(N0, 5))) * (61 + 90 * Math.pow(t0, 2) + 45 * Math.pow(t0, 4))) * Math.pow(DX, 6) * 180 / pi;

    l = L0 + (1 / (k0 * N0 * Math.cos(F0 * pi / 180))) * DX * 180 / pi;
    l = l - (1 / (6 * Math.pow(k0, 3) * Math.pow(N0, 3) * Math.cos(F0 * pi / 180))) * (1 + 2 * Math.pow(t0, 2) + Math.pow(nn0, 2)) * Math.pow(DX, 3) * 180 / pi;
    l = l + (1 / (120 * Math.pow(k0, 5) * Math.pow(N0, 5) * Math.cos(F0 * pi / 180))) * (5 + 6 * Math.pow(nn0, 2) + 28 * Math.pow(t0, 2) + 8 * Math.pow(t0, 2) * Math.pow(nn0, 2) + 24 * Math.pow(t0, 4) - 3 * Math.pow(nn0, 4) - 4 * Math.pow(nn0, 6) + 4 * Math.pow(t0, 2) * Math.pow(nn0, 4) + 24 * Math.pow(t0, 2) * Math.pow(nn0, 6)) * Math.pow(DX, 5) * 180 / pi;
    //l = l - (1 / (5040 *  Math.pow(k0 ,7) * Math.pow(N0, 7) * Math.cos(F0 * pi / 180))) * (61 + 66 *  Math.pow(t0 ,2) + 1320 *  Math.pow(t0 , 4) + 720 *  Math.pow(t0 , 6)) *  Math.pow(DX, 7) * 180 / pi;


    var par = Math.sqrt(1 - (eg_e * eg_e * Math.sin(f * pi / 180) * Math.sin(f * pi / 180)));
    var n = eg_a / (Math.sqrt(1 - (eg_e * eg_e * Math.sin(f * pi / 180) * Math.sin(f * pi / 180))));

    var h = 0;
    var E_x = (n + h) * Math.cos(f * pi / 180) * Math.cos(l * pi / 180);
    var E_y = (n + h) * Math.cos(f * pi / 180) * Math.sin(l * pi / 180);
    var E_z = (n * (1 - eg_e * eg_e) + h) * Math.sin(f * pi / 180);

    var dx = 0;
    var dy = 0;
    var dz = 0;

    var W_x = E_x - dx;
    var W_y = E_y - dy;
    var W_z = E_z - dz;

    var E_mik = Math.atan(W_y / W_x) * 180 / pi;

    var F0 = Math.atan(E_z / ((1 - eg_e * eg_e) * Math.sqrt(W_x * W_x + W_y * W_y)));

    var f1 = Math.atan((W_z + eg_e * eg_e * (eg_a / par) * Math.sin(F0)) / (Math.sqrt(W_x * W_x + W_y * W_y)));

    while (Math.abs(F0 - f1) > 0.000000001 * pi / 180) {
        F0 = f1;
        f1 = Math.atan((W_z + eg_e * eg_e * (eg_a / par) * Math.sin(F0)) / (Math.sqrt(W_x * W_x + W_y * W_y)));
    }

    var E_plat = f1 * 180 / pi;


    l = E_mik;
    f = E_plat;

    out[0] = f;
    out[1] = l;

    return out;

}



