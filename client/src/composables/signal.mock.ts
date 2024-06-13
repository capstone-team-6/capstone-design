import { ref } from "vue";
import { APSignal } from "~/entities/fingerprint";

export const useMockSignal = (isSecond: boolean = false) => {
  const subscribe = (callback: (signal: APSignal[]) => any) => {
    const isLoading = ref(false);
    let isContinue = true;
    let timeoutHandle: NodeJS.Timeout;

    const handler = () => {
      isLoading.value = false;

      callback(isSecond ? mockData2 : mockData);
      isLoading.value = true;

      timeoutHandle = setTimeout(() => handler(), 3000);
    };

    timeoutHandle = setTimeout(() => handler(), 0);
    isLoading.value = true;

    const unsubscribe = () => {
      isContinue = false;
      clearTimeout(timeoutHandle);
    };

    return {
      unsubscribe,
      isLoading,
    };
  };

  const get = (): Promise<APSignal[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData));
    });
  };

  return {
    // scan,
    get,
    subscribe,
  };
};

const mockData: APSignal[] = [
  {
    BSSID: "1c:39:29:4b:e2:8f",
    SSID: "AT_402_AIR_150629_WW_e28f",
    level: -84,
  },
  {
    BSSID: "58:86:94:46:49:60",
    SSID: "VRLABONLY5G",
    level: -69,
  },
  {
    BSSID: "1c:39:29:4b:d8:54",
    SSID: "AT_402_AIR_150629_WW_d854",
    level: -69,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b0",
    SSID: "Smart-CAU",
    level: -56,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b2",
    SSID: "Smart-CAU_5G",
    level: -57,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b1",
    SSID: "eduroam",
    level: -57,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b3",
    SSID: "Smart-CAU_2.4G",
    level: -57,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b1",
    SSID: "eduroam",
    level: -65,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b3",
    SSID: "Smart-CAU_2.4G",
    level: -65,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b2",
    SSID: "Smart-CAU_5G",
    level: -64,
  },
  {
    BSSID: "58:86:94:46:49:62",
    SSID: "VRLABONLY",
    level: -60,
  },
  {
    BSSID: "30:23:03:95:c7:cb",
    SSID: "CSLab_2.4",
    level: -62,
  },
  {
    BSSID: "30:23:03:95:c7:cc",
    SSID: "CSLab",
    level: -70,
  },
  {
    BSSID: "de:41:a9:da:4b:94",
    SSID: "DIRECT-QJMG-LABmsLZ",
    level: -74,
  },
  {
    BSSID: "30:23:03:90:3f:9c",
    SSID: "CSE514-2",
    level: -82,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f1",
    SSID: "eduroam",
    level: -80,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f0",
    SSID: "Smart-CAU",
    level: -80,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f3",
    SSID: "Smart-CAU_2.4G",
    level: -80,
  },
  {
    BSSID: "88:57:1d:54:4f:95",
    SSID: "[air purifier]_E30AJT1013913D",
    level: -71,
  },
  {
    BSSID: "f0:5c:19:a9:b6:a2",
    SSID: "Smart-CAU_2.4G",
    level: -63,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f2",
    SSID: "Smart-CAU_5G",
    level: -80,
  },
  {
    BSSID: "30:23:03:90:40:13",
    SSID: "CSE514-1",
    level: -85,
  },
  {
    BSSID: "f0:5c:19:a9:b6:a1",
    SSID: "eduroam",
    level: -63,
  },
  {
    BSSID: "90:9f:33:66:c1:f8",
    SSID: "iptime",
    level: -76,
  },
  {
    BSSID: "f0:5c:19:a9:b8:a2",
    SSID: "Smart-CAU_2.4G",
    level: -59,
  },
  {
    BSSID: "f0:5c:19:a9:b8:a1",
    SSID: "eduroam",
    level: -59,
  },
  {
    BSSID: "f0:5c:19:a9:bf:42",
    SSID: "Smart-CAU_2.4G",
    level: -71,
  },
  {
    BSSID: "f0:5c:19:a9:bf:41",
    SSID: "eduroam",
    level: -70,
  },
  {
    BSSID: "f0:5c:19:a9:b5:62",
    SSID: "Smart-CAU_2.4G",
    level: -70,
  },
  {
    BSSID: "3a:22:e2:8c:62:39",
    SSID: "DIRECT-39-HP M479dw Color LJ",
    level: -62,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b3",
    SSID: "Smart-CAU_2.4G",
    level: -77,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b0",
    SSID: "Smart-CAU",
    level: -64,
  },
  {
    BSSID: "f0:5c:19:a9:d3:42",
    SSID: "Smart-CAU_2.4G",
    level: -66,
  },
  {
    BSSID: "f0:5c:19:a9:bf:53",
    SSID: "Smart-CAU_2.4G",
    level: -76,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b1",
    SSID: "eduroam",
    level: -77,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b2",
    SSID: "Smart-CAU_5G",
    level: -77,
  },
  {
    BSSID: "70:5d:cc:e4:71:c2",
    SSID: "vllab",
    level: -74,
  },
  {
    BSSID: "6c:70:9f:e4:c7:a8",
    SSID: "MECAS_OFFICE",
    level: -70,
  },
  {
    BSSID: "7c:10:c9:e8:4f:b0",
    SSID: "Biomaterials317",
    level: -72,
  },
  {
    BSSID: "f0:5c:19:a9:d3:41",
    SSID: "eduroam",
    level: -74,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b0",
    SSID: "Smart-CAU",
    level: -78,
  },
  {
    BSSID: "58:86:94:61:b0:90",
    SSID: "UMHRG01_5G",
    level: -85,
  },
  {
    BSSID: "e8:9f:80:56:2f:01",
    SSID: "208-506",
    level: -85,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b0",
    SSID: "Smart-CAU",
    level: -85,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b3",
    SSID: "Smart-CAU_2.4G",
    level: -86,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b1",
    SSID: "eduroam",
    level: -86,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b2",
    SSID: "Smart-CAU_5G",
    level: -86,
  },
  {
    BSSID: "3c:a3:15:01:57:16",
    SSID: "sysganda_5g",
    level: -85,
  },
];

const mockData2: APSignal[] = [
  {
    BSSID: "f0:5c:19:a9:d3:41",
    SSID: "eduroam",
    level: -72,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f3",
    SSID: "Smart-CAU_2.4G",
    level: -80,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f2",
    SSID: "Smart-CAU_5G",
    level: -81,
  },
  {
    BSSID: "30:23:03:99:97:f9",
    SSID: "CSE528-1",
    level: -56,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b0",
    SSID: "Smart-CAU",
    level: -50,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f1",
    SSID: "eduroam",
    level: -79,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f0",
    SSID: "Smart-CAU",
    level: -80,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b0",
    SSID: "Smart-CAU",
    level: -67,
  },
  {
    BSSID: "36:23:03:90:3f:9a",
    SSID: "",
    level: -49,
  },
  {
    BSSID: "30:23:03:90:40:12",
    SSID: "CSE514-1",
    level: -58,
  },
  {
    BSSID: "30:23:03:90:40:13",
    SSID: "CSE514-1",
    level: -68,
  },
  {
    BSSID: "30:23:03:90:40:14",
    SSID: "CSE514-1",
    level: -62,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b3",
    SSID: "Smart-CAU_2.4G",
    level: -68,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b2",
    SSID: "Smart-CAU_5G",
    level: -67,
  },
  {
    BSSID: "f0:5c:19:a9:af:81",
    SSID: "eduroam",
    level: -60,
  },
  {
    BSSID: "f0:5c:19:a9:bf:b3",
    SSID: "Smart-CAU_2.4G",
    level: -60,
  },
  {
    BSSID: "90:9f:33:be:4c:24",
    SSID: "yongwoodang 4-2",
    level: -75,
  },
  {
    BSSID: "30:23:03:99:97:f7",
    SSID: "CSE528-1",
    level: -53,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b2",
    SSID: "Smart-CAU_5G",
    level: -50,
  },
  {
    BSSID: "30:23:03:99:97:f8",
    SSID: "CSE528-1",
    level: -67,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b1",
    SSID: "eduroam",
    level: -50,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b3",
    SSID: "Smart-CAU_2.4G",
    level: -50,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b0",
    SSID: "Smart-CAU",
    level: -59,
  },
  {
    BSSID: "70:5d:cc:60:47:a6",
    SSID: "Smart-IMAGE_5GHz",
    level: -83,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b3",
    SSID: "Smart-CAU_2.4G",
    level: -59,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b1",
    SSID: "eduroam",
    level: -59,
  },
  {
    BSSID: "30:23:03:99:98:52",
    SSID: "CSE529",
    level: -77,
  },
  {
    BSSID: "90:9f:33:65:bc:fc",
    SSID: "Cau_Architecture_1F_5G",
    level: -66,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b2",
    SSID: "Smart-CAU_5G",
    level: -59,
  },
  {
    BSSID: "f0:5c:19:a9:be:b3",
    SSID: "Smart-CAU_2.4G",
    level: -62,
  },
  {
    BSSID: "30:23:03:99:98:51",
    SSID: "CSE529",
    level: -67,
  },
  {
    BSSID: "f0:5c:19:a9:be:b2",
    SSID: "Smart-CAU_5G",
    level: -61,
  },
  {
    BSSID: "36:23:03:99:95:90",
    SSID: "",
    level: -61,
  },
  {
    BSSID: "30:23:03:99:97:df",
    SSID: "CSE526",
    level: -73,
  },
  {
    BSSID: "f0:5c:19:a9:be:b1",
    SSID: "eduroam",
    level: -61,
  },
  {
    BSSID: "58:86:94:82:e2:38",
    SSID: "iptime5G",
    level: -73,
  },
  {
    BSSID: "f0:5c:19:a9:be:b0",
    SSID: "Smart-CAU",
    level: -62,
  },
  {
    BSSID: "f0:5c:19:a9:c9:d0",
    SSID: "Smart-CAU",
    level: -77,
  },
  {
    BSSID: "ae:50:de:dc:bc:1c",
    SSID: "DIRECT-1c-HP M283 LaserJet",
    level: -56,
  },
  {
    BSSID: "30:23:03:99:97:e0",
    SSID: "CSE526",
    level: -76,
  },
  {
    BSSID: "8a:36:6c:83:07:c6",
    SSID: "",
    level: -81,
  },
  {
    BSSID: "7c:10:c9:e8:4f:b0",
    SSID: "Biomaterials317",
    level: -47,
  },
  {
    BSSID: "30:23:03:99:95:91",
    SSID: "CSE515",
    level: -64,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b2",
    SSID: "Smart-CAU_5G",
    level: -73,
  },
  {
    BSSID: "30:23:03:99:95:92",
    SSID: "CSE515",
    level: -65,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b3",
    SSID: "Smart-CAU_2.4G",
    level: -74,
  },
  {
    BSSID: "f0:5c:19:a9:b2:f1",
    SSID: "eduroam",
    level: -76,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b0",
    SSID: "Smart-CAU",
    level: -74,
  },
  {
    BSSID: "30:23:03:95:c7:cc",
    SSID: "CSLab",
    level: -79,
  },
  {
    BSSID: "30:23:03:95:c7:cb",
    SSID: "CSLab_2.4",
    level: -72,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b1",
    SSID: "eduroam",
    level: -74,
  },
  {
    BSSID: "f0:5c:19:a9:b2:f3",
    SSID: "Smart-CAU_2.4G",
    level: -76,
  },
  {
    BSSID: "7c:10:c9:e8:4f:b4",
    SSID: "Biomaterials317",
    level: -63,
  },
  {
    BSSID: "f0:5c:19:a9:be:93",
    SSID: "Smart-CAU_2.4G",
    level: -83,
  },
  {
    BSSID: "30:23:03:90:3f:9c",
    SSID: "CSE514-2",
    level: -46,
  },
  {
    BSSID: "f0:5c:19:a9:be:92",
    SSID: "Smart-CAU_5G",
    level: -83,
  },
  {
    BSSID: "30:23:03:90:3f:9b",
    SSID: "CSE514-2",
    level: -49,
  },
  {
    BSSID: "88:36:6c:d1:3e:52",
    SSID: "iptime",
    level: -60,
  },
  {
    BSSID: "70:5d:cc:6f:9d:50",
    SSID: "Data Science Lab 5G",
    level: -59,
  },
  {
    BSSID: "58:86:94:46:49:60",
    SSID: "VRLABONLY5G",
    level: -76,
  },
  {
    BSSID: "30:23:03:90:3f:9a",
    SSID: "CSE514-2",
    level: -49,
  },
  {
    BSSID: "f0:5c:19:a9:b8:a2",
    SSID: "Smart-CAU_2.4G",
    level: -58,
  },
  {
    BSSID: "88:36:6c:7b:02:48",
    SSID: "CSE518_5G",
    level: -78,
  },
  {
    BSSID: "f0:5c:19:a9:b8:a1",
    SSID: "eduroam",
    level: -60,
  },
  {
    BSSID: "f0:5c:19:a9:bf:a1",
    SSID: "eduroam",
    level: -62,
  },
  {
    BSSID: "f0:5c:19:a9:bf:73",
    SSID: "Smart-CAU_2.4G",
    level: -76,
  },
  {
    BSSID: "f0:5c:19:a9:bf:72",
    SSID: "Smart-CAU_5G",
    level: -77,
  },
  {
    BSSID: "f0:5c:19:a9:bf:70",
    SSID: "Smart-CAU",
    level: -76,
  },
  {
    BSSID: "36:23:03:99:97:f7",
    SSID: "",
    level: -53,
  },
  {
    BSSID: "70:5d:cc:cb:13:d7",
    SSID: "cnlab_5G",
    level: -79,
  },
];
