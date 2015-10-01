'use strict';

app.registerInitialise(function() {

});

models.leafletMap = kendo.observable({
    onShow: function () {
        //todo: multiple buildings at same point - so need to total pcs + get individual room names!
        var nearestPcs = '[{"BuildingId":53481,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60045,"CoordinatesArray":[52.449366,-1.935503],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2955","FacilityName":"Medical School West Lower Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":79.772268946737171,"NoOfPcsFree":63,"RbRoomId":"","RoomBooked":false,"RoomId":"ISMD-WSTL"},{"BuildingId":53481,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60046,"CoordinatesArray":[52.449366,-1.935503],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2955","FacilityName":"Medical School West Upper Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":79.772268946737171,"NoOfPcsFree":25,"RbRoomId":"","RoomBooked":false,"RoomId":"ISMD-WSTU"},{"BuildingId":54989,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59957,"CoordinatesArray":[52.449366,-1.935503],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2958","FacilityName":"Garner Learning Suite","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":79.772268946737171,"NoOfPcsFree":15,"RbRoomId":"","RoomBooked":false,"RoomId":"ISCE-203"},{"BuildingId":53481,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60013,"CoordinatesArray":[52.449366,-1.935503],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2955","FacilityName":"Medical School East Lower Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":79.772268946737171,"NoOfPcsFree":53,"RbRoomId":"","RoomBooked":false,"RoomId":"ISMD-ESTL"},{"BuildingId":53481,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60016,"CoordinatesArray":[52.449366,-1.935503],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2955","FacilityName":"Medical School East Upper Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":79.772268946737171,"NoOfPcsFree":20,"RbRoomId":"","RoomBooked":false,"RoomId":"ISMD-ESTU"},{"BuildingId":53446,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59969,"CoordinatesArray":[52.450632,-1.93567],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Learning Centre LG Open Access","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":107.71649528460242,"NoOfPcsFree":16,"RbRoomId":"","RoomBooked":false,"RoomId":"ISLC-LG35"},{"BuildingId":53446,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59972,"CoordinatesArray":[52.450632,-1.93567],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Learning Centre UG Open Access","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":107.71649528460242,"NoOfPcsFree":7,"RbRoomId":"","RoomBooked":false,"RoomId":"ISLC-UG30"},{"BuildingId":53446,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59970,"CoordinatesArray":[52.450632,-1.93567],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Murray Learning Centre UG08","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":107.71649528460242,"NoOfPcsFree":25,"RbRoomId":"LC-UG08 Cluster","RoomBooked":true,"RoomId":"ISLC-UG08"},{"BuildingId":53446,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59968,"CoordinatesArray":[52.450632,-1.93567],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Murray Learning Centre LG15","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":107.71649528460242,"NoOfPcsFree":50,"RbRoomId":"LC-LG15 Cluster","RoomBooked":true,"RoomId":"ISLC-LG15"},{"BuildingId":53446,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59962,"CoordinatesArray":[52.450632,-1.93567],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Murray Learning Centre LG12","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":107.71649528460242,"NoOfPcsFree":65,"RbRoomId":"LC-LG12 Cluster","RoomBooked":true,"RoomId":"ISLC-LG12"},{"BuildingId":53446,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59964,"CoordinatesArray":[52.450632,-1.93567],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Murray Learning Centre LG13","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":107.71649528460242,"NoOfPcsFree":39,"RbRoomId":"LC-LG13 Cluster","RoomBooked":true,"RoomId":"ISLC-LG13"},{"BuildingId":54996,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60055,"CoordinatesArray":[52.448098,-1.935933],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2958","FacilityName":"Sport and Excercise Science G84","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":215.474210908414,"NoOfPcsFree":48,"RbRoomId":"SPTX-G84 Cluster","RoomBooked":true,"RoomId":"ISSPEX-G84"},{"BuildingId":53437,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59986,"CoordinatesArray":[52.451341,-1.930321],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Main Library Zone 5C Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":337.445768528523,"NoOfPcsFree":0,"RbRoomId":"","RoomBooked":false,"RoomId":"ISML-5C"},{"BuildingId":53437,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59981,"CoordinatesArray":[52.451341,-1.930321],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Main Library Zone 1C Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":337.445768528523,"NoOfPcsFree":10,"RbRoomId":"","RoomBooked":false,"RoomId":"ISML-1C"},{"BuildingId":53437,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60011,"CoordinatesArray":[52.451341,-1.930321],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Main Library Zone LGC Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":337.445768528523,"NoOfPcsFree":21,"RbRoomId":"","RoomBooked":false,"RoomId":"ISML-LGC"},{"BuildingId":53437,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59989,"CoordinatesArray":[52.451341,-1.930321],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Main Library Zone GC Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":337.445768528523,"NoOfPcsFree":38,"RbRoomId":"","RoomBooked":false,"RoomId":"ISML-GC"},{"BuildingId":53437,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59974,"CoordinatesArray":[52.451341,-1.930321],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Main Library Green Room Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":337.445768528523,"NoOfPcsFree":8,"RbRoomId":"ML-GREEN","RoomBooked":false,"RoomId":"ISML-MLZ4"},{"BuildingId":53437,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59977,"CoordinatesArray":[52.451341,-1.930321],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Main Library Orange Room Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":337.445768528523,"NoOfPcsFree":76,"RbRoomId":"ML-Orange","RoomBooked":false,"RoomId":"ISML-MLZ1"},{"BuildingId":53437,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59985,"CoordinatesArray":[52.451341,-1.930321],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Main Library Zone 3C Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":337.445768528523,"NoOfPcsFree":4,"RbRoomId":"","RoomBooked":false,"RoomId":"ISML-3C"},{"BuildingId":53437,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59978,"CoordinatesArray":[52.451341,-1.930321],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Main Library Purple Room Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":337.445768528523,"NoOfPcsFree":0,"RbRoomId":"ML-PURPLE","RoomBooked":false,"RoomId":"ISML-MLZ3-01"},{"BuildingId":53481,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":59954,"CoordinatesArray":[52.452178,-1.938272],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2955","FacilityName":"Barnes Library Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":353.62215708017419,"NoOfPcsFree":18,"RbRoomId":"","RoomBooked":false,"RoomId":"ISBL-1FC"},{"BuildingId":0,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60012,"CoordinatesArray":[52.450785,-1.929517],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":null,"FacilityName":"Arts Mason Lounge Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":364.31925628525528,"NoOfPcsFree":56,"RbRoomId":"","RoomBooked":false,"RoomId":"ISML-MS"},{"BuildingId":53401,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60053,"CoordinatesArray":[52.449863,-1.929259],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Poynting Lower Mezzanine P6","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":367.51348620269391,"NoOfPcsFree":54,"RbRoomId":"PYTG-P06 Cluster","RoomBooked":true,"RoomId":"ISPP-P6"},{"BuildingId":53401,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60054,"CoordinatesArray":[52.449863,-1.929259],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Poynting P9","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":367.51348620269391,"NoOfPcsFree":45,"RbRoomId":"PYTG-P09 Cluster","RoomBooked":true,"RoomId":"ISPP-P9"},{"BuildingId":53315,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60469,"CoordinatesArray":[52.449474,-1.928852],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Nuffield G25 Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":397.64848288887367,"NoOfPcsFree":22,"RbRoomId":"","RoomBooked":false,"RoomId":"ISNUF-G25"},{"BuildingId":53423,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60056,"CoordinatesArray":[52.451541,-1.928197],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Strathcona G4","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":476.97640125168266,"NoOfPcsFree":32,"RbRoomId":"STRA-G04 Cluster","RoomBooked":true,"RoomId":"ISSTR-G04"},{"BuildingId":53423,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60060,"CoordinatesArray":[52.451541,-1.928197],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Strathcona G9","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":476.97640125168266,"NoOfPcsFree":19,"RbRoomId":"","RoomBooked":false,"RoomId":"ISSTR-G09"},{"BuildingId":53423,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60057,"CoordinatesArray":[52.451541,-1.928197],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Strathcona G6","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":476.97640125168266,"NoOfPcsFree":23,"RbRoomId":"STRA-G06 Cluster","RoomBooked":false,"RoomId":"ISSTR-G06"},{"BuildingId":53423,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60058,"CoordinatesArray":[52.451541,-1.928197],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2954","FacilityName":"Strathcona G8","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":476.97640125168266,"NoOfPcsFree":20,"RbRoomId":"","RoomBooked":false,"RoomId":"ISSTR-G08"},{"BuildingId":55006,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60048,"CoordinatesArray":[52.452953,-1.927618],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2956","FacilityName":"Nursing and Physiotherapy Computer Cluster","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":588.62325766344566,"NoOfPcsFree":47,"RbRoomId":"","RoomBooked":false,"RoomId":"HS-CL"},{"BuildingId":55005,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60050,"CoordinatesArray":[52.452953,-1.927618],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2838,0\/1\/2834\/2835\/2838\/2956","FacilityName":"The Link","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":588.62325766344566,"NoOfPcsFree":31,"RbRoomId":"","RoomBooked":false,"RoomId":"ISGK-N139"},{"BuildingId":53130,"CategoryAsTaxonomyIds":"0\/1\/2836\/2837\/2855,0\/1\/2836\/2837\/2855\/2874","ContentId":60051,"CoordinatesArray":[52.434155,-1.947595],"FacilityImageFullUrl":null,"FacilityLocationAsTaxonomyIds":"0\/1\/2834\/2835\/2846,0\/1\/2834\/2835\/2846\/2959","FacilityName":"OLRC Computer Cluster SG05","FacilityWebPage":"","Category":"Learning and Teaching, Computer room","FacilityDescription":"","OpeningHours":"","PcAvailabilityCluster":true,"DistanceTo":1956.8434565876235,"NoOfPcsFree":30,"RbRoomId":"OLRC-G05","RoomBooked":false,"RoomId":"IS-OLRC-G05"}]';

        var otherObjects = '{"Success":true,"Results":[{"ID":2801,"Long":-2.5309751033783,"Lat":52.4258728027344,"Distance":0},{"ID":2831,"Long":-2.43484497070313,"Lat":52.6847076416016,"Distance":0},{"ID":2811,"Long":-2.2975161075592,"Lat":52.3923645019531,"Distance":0},{"ID":2791,"Long":-2.22061204910278,"Lat":52.1890907287598,"Distance":0},{"ID":2751,"Long":-2.17117309570313,"Lat":52.6130561828613,"Distance":0},{"ID":3041,"Long":-2.13512396812439,"Lat":52.4748344421387,"Distance":0},{"ID":3081,"Long":-2.13134789466858,"Lat":52.459358215332,"Distance":0},{"ID":3061,"Long":-2.12825798988342,"Lat":52.4386405944824,"Distance":0},{"ID":2291,"Long":-2.12290191650391,"Lat":52.4672927856445,"Distance":0},{"ID":2301,"Long":-2.10147905349731,"Lat":52.4769248962402,"Distance":0},{"ID":3071,"Long":-2.09255194664001,"Lat":52.4923973083496,"Distance":0},{"ID":3031,"Long":-2.08637189865112,"Lat":52.4501495361328,"Distance":0},{"ID":3051,"Long":-2.07847595214844,"Lat":52.4921875,"Distance":0},{"ID":3011,"Long":-2.06199598312378,"Lat":52.4708595275879,"Distance":0},{"ID":2971,"Long":-2.05858993530273,"Lat":52.4179763793945,"Distance":0},{"ID":2321,"Long":-2.05821990966797,"Lat":52.4848709106445,"Distance":0},{"ID":2311,"Long":-2.05615997314453,"Lat":52.424617767334,"Distance":0},{"ID":3021,"Long":-2.03075408935547,"Lat":52.4608192443848,"Distance":0},{"ID":3001,"Long":-2.01324510574341,"Lat":52.5304260253906,"Distance":0},{"ID":2131,"Long":-2.00385093688965,"Lat":52.4403915405273,"Distance":0},{"ID":2141,"Long":-2.00385093688965,"Lat":52.4404716491699,"Distance":0},{"ID":2451,"Long":-2.00354599952698,"Lat":52.4340362548828,"Distance":0},{"ID":2251,"Long":-2.00280809402466,"Lat":52.468318939209,"Distance":0},{"ID":2941,"Long":-2.00148606300354,"Lat":52.4247207641602,"Distance":0},{"ID":2591,"Long":-2.00038695335388,"Lat":52.4640808105469,"Distance":0},{"ID":2601,"Long":-2.00038695335388,"Lat":52.4640808105469,"Distance":0},{"ID":2991,"Long":-1.99745202064514,"Lat":52.5304260253906,"Distance":0},{"ID":2911,"Long":-1.99685096740723,"Lat":52.4273376464844,"Distance":0},{"ID":2441,"Long":-1.99547803401947,"Lat":52.4385375976563,"Distance":0},{"ID":2361,"Long":-1.99410402774811,"Lat":52.4515113830566,"Distance":0},{"ID":2901,"Long":-1.99324595928192,"Lat":52.429744720459,"Distance":0},{"ID":2571,"Long":-1.99302101135254,"Lat":52.4711036682129,"Distance":0},{"ID":2581,"Long":-1.99302101135254,"Lat":52.4711036682129,"Distance":0},{"ID":2381,"Long":-1.9922159910202,"Lat":52.4591484069824,"Distance":0},{"ID":2691,"Long":-1.99067103862762,"Lat":52.4255599975586,"Distance":0},{"ID":2281,"Long":-1.99023902416229,"Lat":52.5469131469727,"Distance":0},{"ID":2371,"Long":-1.9886109828949,"Lat":52.4626007080078,"Distance":0},{"ID":2121,"Long":-1.98803102970123,"Lat":52.4824333190918,"Distance":0},{"ID":2931,"Long":-1.98792505264282,"Lat":52.4221038818359,"Distance":0},{"ID":2391,"Long":-1.98500597476959,"Lat":52.4493141174316,"Distance":0},{"ID":2261,"Long":-1.98494398593903,"Lat":52.4755325317383,"Distance":0},{"ID":2271,"Long":-1.98481094837189,"Lat":52.4971122741699,"Distance":0},{"ID":2331,"Long":-1.98432004451752,"Lat":52.4547538757324,"Distance":0},{"ID":2351,"Long":-1.98328995704651,"Lat":52.4316291809082,"Distance":0},{"ID":3101,"Long":-1.98105800151825,"Lat":52.4401054382324,"Distance":0},{"ID":2411,"Long":-1.98052597045898,"Lat":52.4701232910156,"Distance":0},{"ID":2401,"Long":-1.97693800926208,"Lat":52.4293251037598,"Distance":0},{"ID":2091,"Long":-1.97644996643066,"Lat":52.4621467590332,"Distance":0},{"ID":2421,"Long":-1.97521102428436,"Lat":52.4217376708984,"Distance":0},{"ID":1921,"Long":-1.97519898414612,"Lat":52.4455718994141,"Distance":0},{"ID":2551,"Long":-1.97328996658325,"Lat":52.4783363342285,"Distance":0},{"ID":1731,"Long":-1.97230303287506,"Lat":52.4533958435059,"Distance":0},{"ID":1851,"Long":-1.97092998027802,"Lat":52.4342460632324,"Distance":0},{"ID":1711,"Long":-1.96852695941925,"Lat":52.4714889526367,"Distance":0},{"ID":1721,"Long":-1.96663904190063,"Lat":52.4655265808105,"Distance":0},{"ID":2201,"Long":-1.96572196483612,"Lat":52.4971237182617,"Distance":0},{"ID":2191,"Long":-1.96572196483612,"Lat":52.4972038269043,"Distance":0},{"ID":3091,"Long":-1.96543705463409,"Lat":52.4631233215332,"Distance":0},{"ID":2341,"Long":-1.96492195129395,"Lat":52.4296417236328,"Distance":0},{"ID":2611,"Long":-1.96419596672058,"Lat":52.4778938293457,"Distance":0},{"ID":2621,"Long":-1.96419596672058,"Lat":52.4778938293457,"Distance":0},{"ID":3111,"Long":-1.96286201477051,"Lat":52.4434547424316,"Distance":0},{"ID":1561,"Long":-1.96200394630432,"Lat":52.4570541381836,"Distance":0},{"ID":1951,"Long":-1.95942902565002,"Lat":52.4345588684082,"Distance":0},{"ID":2721,"Long":-1.95891404151917,"Lat":52.4247207641602,"Distance":0},{"ID":2431,"Long":-1.95788395404816,"Lat":52.476505279541,"Distance":0},{"ID":2561,"Long":-1.95685398578644,"Lat":52.4889488220215,"Distance":0},{"ID":1591,"Long":-1.95599603652954,"Lat":52.4413604736328,"Distance":0},{"ID":1571,"Long":-1.95599603652954,"Lat":52.4647941589355,"Distance":0},{"ID":1491,"Long":-1.95432198047638,"Lat":52.457893371582,"Distance":0},{"ID":1481,"Long":-1.95294904708862,"Lat":52.452033996582,"Distance":0},{"ID":1551,"Long":-1.95251905918121,"Lat":52.4477462768555,"Distance":0},{"ID":2001,"Long":-1.94964396953583,"Lat":52.4683494567871,"Distance":0},{"ID":1881,"Long":-1.94912898540497,"Lat":52.4371757507324,"Distance":0},{"ID":1911,"Long":-1.94603896141052,"Lat":52.4269218444824,"Distance":0},{"ID":1511,"Long":-1.94590997695923,"Lat":52.4597244262695,"Distance":0},{"ID":1931,"Long":-1.94424498081207,"Lat":52.4388732910156,"Distance":0},{"ID":1941,"Long":-1.94424498081207,"Lat":52.4388732910156,"Distance":0},{"ID":1701,"Long":-1.94415104389191,"Lat":52.4715919494629,"Distance":0},{"ID":1371,"Long":-1.94367897510529,"Lat":52.4463844299316,"Distance":0},{"ID":1871,"Long":-1.94277799129486,"Lat":52.457160949707,"Distance":0},{"ID":2631,"Long":-1.94243395328522,"Lat":52.4791221618652,"Distance":0},{"ID":1381,"Long":-1.94101798534393,"Lat":52.4518241882324,"Distance":0},{"ID":1641,"Long":-1.93985903263092,"Lat":52.4339332580566,"Distance":0},{"ID":1281,"Long":-1.93973100185394,"Lat":52.4405784606934,"Distance":0},{"ID":2541,"Long":-1.93960201740265,"Lat":52.4676208496094,"Distance":0},{"ID":1601,"Long":-1.93882894515991,"Lat":52.4585189819336,"Distance":0},{"ID":1291,"Long":-1.93578195571899,"Lat":52.4468040466309,"Distance":0},{"ID":2731,"Long":-1.93471002578735,"Lat":52.4235687255859,"Distance":0},{"ID":3121,"Long":-1.93467700481415,"Lat":52.4498748779297,"Distance":0},{"ID":1321,"Long":-1.9327780008316,"Lat":52.4513549804688,"Distance":0},{"ID":1981,"Long":-1.9324779510498,"Lat":52.4296417236328,"Distance":0},{"ID":1361,"Long":-1.93234896659851,"Lat":52.4397392272949,"Distance":0},{"ID":1841,"Long":-1.93101894855499,"Lat":52.4748344421387,"Distance":0},{"ID":3131,"Long":-1.9307769536972,"Lat":52.4504928588867,"Distance":0},{"ID":1391,"Long":-1.92865800857544,"Lat":52.4565315246582,"Distance":0},{"ID":1541,"Long":-1.9281439781189,"Lat":52.4626007080078,"Distance":0},{"ID":2051,"Long":-1.92781603336334,"Lat":52.4688873291016,"Distance":0},{"ID":2061,"Long":-1.92781603336334,"Lat":52.4688873291016,"Distance":0},{"ID":1861,"Long":-1.92767095565796,"Lat":52.452766418457,"Distance":0},{"ID":1351,"Long":-1.92694199085236,"Lat":52.443244934082,"Distance":0},{"ID":1631,"Long":-1.92509698867798,"Lat":52.4363403320313,"Distance":0},{"ID":1401,"Long":-1.92359399795532,"Lat":52.4550666809082,"Distance":0},{"ID":1301,"Long":-1.92325103282928,"Lat":52.4477958679199,"Distance":0},{"ID":1991,"Long":-1.92235004901886,"Lat":52.4293251037598,"Distance":0},{"ID":1471,"Long":-1.92179203033447,"Lat":52.4417266845703,"Distance":0},{"ID":2681,"Long":-1.92166304588318,"Lat":52.4228363037109,"Distance":0},{"ID":2981,"Long":-1.92123401165009,"Lat":52.496997833252,"Distance":0},{"ID":1751,"Long":-1.92028999328613,"Lat":52.4691886901855,"Distance":0},{"ID":1681,"Long":-1.91891694068909,"Lat":52.432674407959,"Distance":0},{"ID":1811,"Long":-1.91857302188873,"Lat":52.4651107788086,"Distance":0},{"ID":2521,"Long":-1.91677105426788,"Lat":52.4752540588379,"Distance":0},{"ID":1461,"Long":-1.91586995124817,"Lat":52.4398956298828,"Distance":0},{"ID":1311,"Long":-1.91509699821472,"Lat":52.451774597168,"Distance":0},{"ID":1411,"Long":-1.91475403308868,"Lat":52.4600372314453,"Distance":0},{"ID":2841,"Long":-1.91299402713776,"Lat":52.754581451416,"Distance":0},{"ID":1441,"Long":-1.91200697422028,"Lat":52.4457588195801,"Distance":0},{"ID":1761,"Long":-1.91136395931244,"Lat":52.4674110412598,"Distance":0},{"ID":1431,"Long":-1.91037702560425,"Lat":52.4513549804688,"Distance":0},{"ID":2231,"Long":-1.90969204902649,"Lat":52.5042304992676,"Distance":0},{"ID":2241,"Long":-1.90969204902649,"Lat":52.5043106079102,"Distance":0},{"ID":1421,"Long":-1.90857398509979,"Lat":52.4578399658203,"Distance":0},{"ID":1621,"Long":-1.9075870513916,"Lat":52.4320487976074,"Distance":0},{"ID":1801,"Long":-1.90724396705627,"Lat":52.4389533996582,"Distance":0},{"ID":2531,"Long":-1.90475499629974,"Lat":52.4254531860352,"Distance":0},{"ID":2071,"Long":-1.90462803840637,"Lat":52.4732971191406,"Distance":0},{"ID":2081,"Long":-1.90462803840637,"Lat":52.4732971191406,"Distance":0},{"ID":2031,"Long":-1.90046298503876,"Lat":52.4602241516113,"Distance":0},{"ID":2041,"Long":-1.90046298503876,"Lat":52.4602241516113,"Distance":0},{"ID":1771,"Long":-1.90003395080566,"Lat":52.4637489318848,"Distance":0},{"ID":1671,"Long":-1.89677202701569,"Lat":52.4398956298828,"Distance":0},{"ID":1661,"Long":-1.89677202701569,"Lat":52.4548606872559,"Distance":0},{"ID":2741,"Long":-1.89488399028778,"Lat":52.4236755371094,"Distance":0},{"ID":1791,"Long":-1.89385402202606,"Lat":52.4509887695313,"Distance":0},{"ID":1781,"Long":-1.89368200302124,"Lat":52.4613456726074,"Distance":0},{"ID":2011,"Long":-1.89351105690002,"Lat":52.431526184082,"Distance":0},{"ID":2491,"Long":-1.88990604877472,"Lat":52.4698143005371,"Distance":0},{"ID":2711,"Long":-1.88595795631409,"Lat":52.4379081726074,"Distance":0},{"ID":2501,"Long":-1.88424098491669,"Lat":52.4672012329102,"Distance":0},{"ID":2641,"Long":-1.88406896591187,"Lat":52.4453392028809,"Distance":0},{"ID":2701,"Long":-1.88303899765015,"Lat":52.424617767334,"Distance":0},{"ID":2471,"Long":-1.88115096092224,"Lat":52.4574737548828,"Distance":0},{"ID":2171,"Long":-1.87544894218445,"Lat":52.4372291564941,"Distance":0},{"ID":2181,"Long":-1.87544894218445,"Lat":52.4373092651367,"Distance":0},{"ID":2511,"Long":-1.87514305114746,"Lat":52.4525566101074,"Distance":0},{"ID":1961,"Long":-1.87359797954559,"Lat":52.4179153442383,"Distance":0},{"ID":2111,"Long":-1.86612105369568,"Lat":52.4491920471191,"Distance":0},{"ID":2101,"Long":-1.86612105369568,"Lat":52.4492721557617,"Distance":0},{"ID":2671,"Long":-1.86535799503326,"Lat":52.4651107788086,"Distance":0},{"ID":2661,"Long":-1.86415696144104,"Lat":52.4766120910645,"Distance":0},{"ID":2821,"Long":-1.8580629825592,"Lat":52.2244338989258,"Distance":0},{"ID":1971,"Long":-1.8461320400238,"Lat":52.4186477661133,"Distance":0},{"ID":2161,"Long":-1.84380495548248,"Lat":52.4724807739258,"Distance":0},{"ID":2151,"Long":-1.84380495548248,"Lat":52.4725608825684,"Distance":0},{"ID":2221,"Long":-1.82616496086121,"Lat":52.4904899597168,"Distance":0},{"ID":2211,"Long":-1.82616496086121,"Lat":52.4905700683594,"Distance":0},{"ID":2021,"Long":-1.79289305210114,"Lat":52.4332580566406,"Distance":0},{"ID":2761,"Long":-1.70425403118134,"Lat":52.6030464172363,"Distance":0},{"ID":2781,"Long":-1.64657604694366,"Lat":52.2277984619141,"Distance":0},{"ID":2771,"Long":-1.3554379940033,"Lat":52.4543342590332,"Distance":0},{"ID":2851,"Long":-1.1549379825592,"Lat":52.7512550354004,"Distance":0}]}';

        //   var directionsApiUrlGoogle = "https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyAy3jXOCP_FfB91A30JuR9DoWVTQCNUQvk&mode=walking";
        //  var directionsApiUrlGraphHopper = "https://graphhopper.com/api/1/route?key=d297d5f6-8ff0-405f-b15b-51966ee041e6&vehicle=foot&type=json&points_encoded=false";



        var nearestPcsObjects;

        var otherDataObjects;

        var centralCampus = [52.45049111433046, -1.9307774305343628];
        var pcsUrl = "http://www.birmingham.ac.uk/web_services/Clusters.svc/nearestpc?lat=" + centralCampus[0] + "&long=" + centralCampus[1];


        var otherLayerData = "http://geomobiletest.azurewebsites.net/api/Geo/GetAll";

        //get mainPc data
        $.ajax({
            url: pcsUrl,
            dataType: 'json',
            success: function (data) {
                if (data)
                    nearestPcsObjects = JSON.parse(data);
                else
                    nearestPcsObjects = JSON.parse(nearestPcs);

                setUpMap();
            },
            error: function (error) {
                console.log("error fetching json pc data");
                nearestPcsObjects = JSON.parse(nearestPcs);
                setUpMap();
            }
        });

        //get extra data
        $.ajax({
            url: otherLayerData,
            dataType: 'json',
            success: function (data) {
                if (data)
                    otherDataObjects = JSON.parse(data.Results);
                else
                    otherDataObjects = JSON.parse(otherObjects);

                //     else
                //   nearestPcsObjects = JSON.parse(nearestPcs);

                //  setUpMap();
            },
            error: function (error) {
                console.log("error fetching other objects data");
                otherDataObjects = JSON.parse(otherObjects);
                //    setUpMap();
            }
        });

        nearestPcsObjects = JSON.parse(nearestPcs);
        otherDataObjects = JSON.parse(otherObjects);

        var map = L.map('map').setView(centralCampus, 17);

        var routeControl;


        var getDirections = function (originLng, originLat, destinationLng, destinationLat) {

            if (routeControl)
                map.removeControl(routeControl);


            routeControl = L.Routing.control({
                waypoints: [
                    L.latLng(originLng, originLat),
                    L.latLng(destinationLng, destinationLat)
                ],
                router: L.Routing.valhalla('valhalla-rRUHtYw', 'pedestrian', { pedestrian: { step_penalty: 10, alley_factor: 0.1, driveway_factor: 10 } }),
                formatter: new L.Routing.Valhalla.Formatter({ units: 'imperial' }),
                routeWhileDragging: false,
                autoRoute: true
            }).addTo(map);
        }


        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);



        var setUpMap = function () {
            var spinIcon = L.AwesomeMarkers.icon({ icon: 'male', prefix: 'fa', markerColor: 'blue', spin: true });

            L.marker(centralCampus, { icon: spinIcon }).addTo(map);

            var markers = L.markerClusterGroup({

                maxClusterRadius: 90,
                spiderfyDistanceMultiplier: 2,
                iconCreateFunction: function (cluster) {
                    var markers = cluster.getAllChildMarkers();

                    var n = 0;
                    for (var i = 0; i < markers.length; i++) {
                        n += markers[i].options.NoOfPcsFree;
                    }

                    var c = ' marker-cluster-';
                    if (n < 10) {
                        c += 'small';
                    } else if (n < 100) {
                        c += 'medium';
                    } else {
                        c += 'large';
                    }

                    return new L.DivIcon({ html: '<div><span>' + n + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });

                }

            });



            var extraMarkers = L.markerClusterGroup({

                maxClusterRadius: 90,
                spiderfyDistanceMultiplier: 2

            });

            var nearestPcsLayer = new L.LayerGroup();
            var otherItemsLayer = new L.LayerGroup();

            if (nearestPcsObjects) {
                var markStore = [];


                var arraySize = nearestPcsObjects.length - 1;

                do {
                    var item = nearestPcsObjects[arraySize];

                    var info = "<div>" + item.FacilityName + "</div><div>Availible PCs: " + item.NoOfPcsFree + "</div><div><button onclick='javascript:getDirections( " + centralCampus[0] + ", " + centralCampus[1] + ", " + item.CoordinatesArray[0] + ", " + item.CoordinatesArray[1] + ");'>Directions</button></div>";

                    var colour = "";

                    if (item.NoOfPcsFree > 40) {
                        colour = "green";
                    }
                    else if (item.NoOfPcsFree > 10) {
                        colour = "orange";

                    }
                    else {
                        colour = "red";
                    }

                    markStore[arraySize] = new L.Marker(
                        item.CoordinatesArray,
                        { icon: L.AwesomeMarkers.icon({ icon: '', prefix: 'fa', markerColor: colour, html: item.NoOfPcsFree }), NoOfPcsFree: item.NoOfPcsFree }).bindPopup(info);

                } while (arraySize--)

                markers.addLayers(markStore);

                nearestPcsLayer.addLayer(markers).addTo(map);

            };




            if (otherDataObjects) {
                var markStore1 = [];


                var arraySize1 = otherDataObjects.Results.length - 1;

                do {

                    var item = otherDataObjects.Results[arraySize1];

                    var info = "another point";

                    var colour = "purple";

                    markStore1[arraySize1] = new L.Marker(
                        [item.Lat, item.Long],
                        { icon: L.AwesomeMarkers.icon({ icon: '', prefix: 'fa', markerColor: colour }) }).bindPopup(info);

                } while (arraySize1--)

                extraMarkers.addLayers(markStore1);

                otherItemsLayer.addLayer(extraMarkers);
            }

            L.control.layers({ "nearest Pcs": nearestPcsLayer, "other Objects": otherItemsLayer }).addTo(map);

        };
    },
    title: "Map"
});