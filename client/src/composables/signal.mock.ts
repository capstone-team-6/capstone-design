import { ref } from "vue";
import { APSignal } from "~/entities/fingerprint";

export const useMockSignal = (isSecond: boolean = false) => {
  const scan = () => (window as any).Bridge.startScan();

  const subscribe = (callback: (signal: APSignal[]) => any) => {
    const isLoading = ref(false);
    let isContinue = true;
    let timeoutHandle: NodeJS.Timeout;

    const handler = () => {
      isLoading.value = false;

      isLoading.value = true;
      timeoutHandle = setTimeout(
        () => callback(isSecond ? mockData2 : mockData),
        3000
      );
    };

    timeoutHandle = setTimeout(() => handler(), 3000);
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
    BSSID: "f0:5c:19:a9:d3:41",
    SSID: "eduroam",
    level: -54,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b0",
    SSID: "Smart-CAU",
    level: -62,
  },
  {
    BSSID: "30:23:03:99:97:f9",
    SSID: "CSE528-1",
    level: -74,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b1",
    SSID: "eduroam",
    level: -55,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b0",
    SSID: "Smart-CAU",
    level: -49,
  },
  {
    BSSID: "30:23:03:90:40:12",
    SSID: "CSE514-1",
    level: -52,
  },
  {
    BSSID: "36:23:03:90:3f:9a",
    SSID: "",
    level: -54,
  },
  {
    BSSID: "30:23:03:90:40:13",
    SSID: "CSE514-1",
    level: -61,
  },
  {
    BSSID: "30:23:03:90:40:14",
    SSID: "CSE514-1",
    level: -60,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b3",
    SSID: "Smart-CAU_2.4G",
    level: -56,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b2",
    SSID: "Smart-CAU_5G",
    level: -54,
  },
  {
    BSSID: "f0:5c:19:a9:be:a2",
    SSID: "Smart-CAU_2.4G",
    level: -63,
  },
  {
    BSSID: "f0:5c:19:a9:b5:61",
    SSID: "eduroam",
    level: -66,
  },
  {
    BSSID: "f0:5c:19:a9:c9:c1",
    SSID: "eduroam",
    level: -80,
  },
  {
    BSSID: "70:5d:cc:6a:6e:82",
    SSID: "iptime",
    level: -75,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b2",
    SSID: "Smart-CAU_5G",
    level: -62,
  },
  {
    BSSID: "30:23:03:99:97:f7",
    SSID: "CSE528-1",
    level: -65,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b1",
    SSID: "eduroam",
    level: -62,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b3",
    SSID: "Smart-CAU_2.4G",
    level: -62,
  },
  {
    BSSID: "f0:5c:19:a9:bf:42",
    SSID: "Smart-CAU_2.4G",
    level: -63,
  },
  {
    BSSID: "f0:5c:19:a9:d3:52",
    SSID: "Smart-CAU_5G",
    level: -65,
  },
  {
    BSSID: "f0:5c:19:a9:d3:53",
    SSID: "Smart-CAU_2.4G",
    level: -66,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b0",
    SSID: "Smart-CAU",
    level: -68,
  },
  {
    BSSID: "f0:5c:19:a9:d3:50",
    SSID: "Smart-CAU",
    level: -65,
  },
  {
    BSSID: "f0:5c:19:a9:d3:51",
    SSID: "eduroam",
    level: -65,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b3",
    SSID: "Smart-CAU_2.4G",
    level: -67,
  },
  {
    BSSID: "30:23:03:99:98:53",
    SSID: "CSE529",
    level: -64,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b1",
    SSID: "eduroam",
    level: -66,
  },
  {
    BSSID: "30:23:03:99:98:51",
    SSID: "CSE529",
    level: -57,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b2",
    SSID: "Smart-CAU_5G",
    level: -68,
  },
  {
    BSSID: "f0:5c:19:a9:be:b3",
    SSID: "Smart-CAU_2.4G",
    level: -69,
  },
  {
    BSSID: "f0:5c:19:a9:be:b2",
    SSID: "Smart-CAU_5G",
    level: -69,
  },
  {
    BSSID: "36:23:03:99:95:90",
    SSID: "",
    level: -72,
  },
  {
    BSSID: "36:23:03:90:40:12",
    SSID: "",
    level: -59,
  },
  {
    BSSID: "f0:5c:19:a9:be:b1",
    SSID: "eduroam",
    level: -69,
  },
  {
    BSSID: "f0:5c:19:a9:be:b0",
    SSID: "Smart-CAU",
    level: -68,
  },
  {
    BSSID: "f0:5c:19:a9:bf:52",
    SSID: "Smart-CAU_5G",
    level: -73,
  },
  {
    BSSID: "f0:5c:19:a9:bf:51",
    SSID: "eduroam",
    level: -75,
  },
  {
    BSSID: "f0:5c:19:a9:c9:d1",
    SSID: "eduroam",
    level: -84,
  },
  {
    BSSID: "1c:39:29:4b:e2:8f",
    SSID: "AT_402_AIR_150629_WW_e28f",
    level: -73,
  },
  {
    BSSID: "f0:5c:19:a9:b5:73",
    SSID: "Smart-CAU_2.4G",
    level: -79,
  },
  {
    BSSID: "f0:5c:19:a9:c9:d2",
    SSID: "Smart-CAU_5G",
    level: -84,
  },
  {
    BSSID: "f0:5c:19:a9:bf:53",
    SSID: "Smart-CAU_2.4G",
    level: -73,
  },
  {
    BSSID: "86:25:19:10:a4:65",
    SSID: "DIRECT-nLC48x Series",
    level: -70,
  },
  {
    BSSID: "30:23:03:99:95:91",
    SSID: "CSE515",
    level: -73,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b2",
    SSID: "Smart-CAU_5G",
    level: -65,
  },
  {
    BSSID: "f0:5c:19:a9:b2:f0",
    SSID: "Smart-CAU",
    level: -79,
  },
  {
    BSSID: "30:23:03:99:95:92",
    SSID: "CSE515",
    level: -71,
  },
  {
    BSSID: "30:23:03:95:c7:cc",
    SSID: "CSLab",
    level: -66,
  },
  {
    BSSID: "f0:5c:19:a9:b2:f2",
    SSID: "Smart-CAU_5G",
    level: -78,
  },
  {
    BSSID: "30:23:03:95:c7:cb",
    SSID: "CSLab_2.4",
    level: -54,
  },
  {
    BSSID: "f0:5c:19:a9:b2:f3",
    SSID: "Smart-CAU_2.4G",
    level: -77,
  },
  {
    BSSID: "58:86:94:61:b0:92",
    SSID: "UMHRG01",
    level: -63,
  },
  {
    BSSID: "ba:60:f9:a4:8b:fd",
    SSID: "",
    level: -64,
  },
  {
    BSSID: "30:23:03:90:3f:9c",
    SSID: "CSE514-2",
    level: -56,
  },
  {
    BSSID: "30:23:03:90:3f:9b",
    SSID: "CSE514-2",
    level: -66,
  },
  {
    BSSID: "58:86:94:46:49:62",
    SSID: "VRLABONLY",
    level: -61,
  },
  {
    BSSID: "70:5d:cc:6f:9d:50",
    SSID: "Data Science Lab 5G",
    level: -67,
  },
  {
    BSSID: "34:60:f9:a4:8b:fb",
    SSID: "parkh",
    level: -57,
  },
  {
    BSSID: "30:23:03:90:3f:9a",
    SSID: "CSE514-2",
    level: -55,
  },
  {
    BSSID: "90:9f:33:d7:af:f0",
    SSID: "DDRL",
    level: -57,
  },
  {
    BSSID: "f0:5c:19:a9:b8:a2",
    SSID: "Smart-CAU_2.4G",
    level: -59,
  },
  {
    BSSID: "f0:5c:19:a9:b8:a1",
    SSID: "eduroam",
    level: -58,
  },
  {
    BSSID: "86:2a:fd:f0:b9:da",
    SSID: "DIRECT-DA-HP ",
    level: -59,
  },
  {
    BSSID: "f0:5c:19:a9:c0:a1",
    SSID: "eduroam",
    level: -54,
  },
  {
    BSSID: "f0:5c:19:a9:c0:a2",
    SSID: "Smart-CAU_2.4G",
    level: -60,
  },
];

const mockData2: APSignal[] = [
  {
    BSSID: "f0:5c:19:a9:d3:41",
    SSID: "eduroam",
    level: -67,
  },
  {
    BSSID: "f0:5c:19:a9:d3:42",
    SSID: "Smart-CAU_2.4G",
    level: -66,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f2",
    SSID: "Smart-CAU_5G",
    level: -68,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b0",
    SSID: "Smart-CAU",
    level: -72,
  },
  {
    BSSID: "f0:5c:19:a9:bf:f0",
    SSID: "Smart-CAU",
    level: -69,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b1",
    SSID: "eduroam",
    level: -54,
  },
  {
    BSSID: "88:57:1d:54:4f:95",
    SSID: "[air purifier]_E30AJT1013913D",
    level: -58,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b0",
    SSID: "Smart-CAU",
    level: -48,
  },
  {
    BSSID: "70:5d:cc:e4:71:c2",
    SSID: "vllab",
    level: -60,
  },
  {
    BSSID: "30:23:03:90:40:12",
    SSID: "CSE514-1",
    level: -71,
  },
  {
    BSSID: "36:23:03:95:c7:cb",
    SSID: "",
    level: -56,
  },
  {
    BSSID: "30:23:03:90:40:13",
    SSID: "CSE514-1",
    level: -76,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b3",
    SSID: "Smart-CAU_2.4G",
    level: -54,
  },
  {
    BSSID: "f0:5c:19:a9:b8:b2",
    SSID: "Smart-CAU_5G",
    level: -54,
  },
  {
    BSSID: "f0:5c:19:a9:bf:b0",
    SSID: "Smart-CAU",
    level: -74,
  },
  {
    BSSID: "3a:22:e2:8c:62:39",
    SSID: "DIRECT-39-HP M479dw Color LJ",
    level: -53,
  },
  {
    BSSID: "f0:5c:19:a9:b5:62",
    SSID: "Smart-CAU_2.4G",
    level: -66,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b2",
    SSID: "Smart-CAU_5G",
    level: -72,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b1",
    SSID: "eduroam",
    level: -72,
  },
  {
    BSSID: "30:23:03:99:97:f8",
    SSID: "CSE528-1",
    level: -82,
  },
  {
    BSSID: "f0:5c:19:a9:b1:02",
    SSID: "Smart-CAU_2.4G",
    level: -81,
  },
  {
    BSSID: "f0:5c:19:a9:c0:b3",
    SSID: "Smart-CAU_2.4G",
    level: -72,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b0",
    SSID: "Smart-CAU",
    level: -80,
  },
  {
    BSSID: "f0:5c:19:a9:d3:51",
    SSID: "eduroam",
    level: -80,
  },
  {
    BSSID: "f0:5c:19:a9:b6:a1",
    SSID: "eduroam",
    level: -55,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b3",
    SSID: "Smart-CAU_2.4G",
    level: -80,
  },
  {
    BSSID: "f0:5c:19:a9:b6:a2",
    SSID: "Smart-CAU_2.4G",
    level: -41,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b1",
    SSID: "eduroam",
    level: -80,
  },
  {
    BSSID: "5a:86:94:c0:27:58",
    SSID: "ixlab_5G",
    level: -77,
  },
  {
    BSSID: "f0:5c:19:a9:b7:b2",
    SSID: "Smart-CAU_5G",
    level: -81,
  },
  {
    BSSID: "f0:5c:19:a9:bf:52",
    SSID: "Smart-CAU_5G",
    level: -67,
  },
  {
    BSSID: "58:86:94:61:b0:90",
    SSID: "UMHRG01_5G",
    level: -77,
  },
  {
    BSSID: "f0:5c:19:a9:bf:51",
    SSID: "eduroam",
    level: -67,
  },
  {
    BSSID: "f0:5c:19:a9:bf:50",
    SSID: "Smart-CAU",
    level: -67,
  },
  {
    BSSID: "f0:5c:19:a9:b5:71",
    SSID: "eduroam",
    level: -76,
  },
  {
    BSSID: "1c:39:29:4b:e2:8f",
    SSID: "AT_402_AIR_150629_WW_e28f",
    level: -73,
  },
  {
    BSSID: "f0:5c:19:a9:b5:70",
    SSID: "Smart-CAU",
    level: -76,
  },
  {
    BSSID: "f0:5c:19:a9:b5:73",
    SSID: "Smart-CAU_2.4G",
    level: -76,
  },
  {
    BSSID: "f0:5c:19:a9:b5:72",
    SSID: "Smart-CAU_5G",
    level: -75,
  },
  {
    BSSID: "de:41:a9:da:4b:94",
    SSID: "DIRECT-QJMG-LABmsLZ",
    level: -67,
  },
  {
    BSSID: "f0:5c:19:a9:bf:53",
    SSID: "Smart-CAU_2.4G",
    level: -67,
  },
  {
    BSSID: "70:5d:cc:c9:0b:c2",
    SSID: "CSBR_BEESL",
    level: -60,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b2",
    SSID: "Smart-CAU_5G",
    level: -60,
  },
  {
    BSSID: "f0:5c:19:a9:b2:f0",
    SSID: "Smart-CAU",
    level: -80,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b3",
    SSID: "Smart-CAU_2.4G",
    level: -61,
  },
  {
    BSSID: "f0:5c:19:a9:b2:f1",
    SSID: "eduroam",
    level: -79,
  },
  {
    BSSID: "30:23:03:95:c7:cc",
    SSID: "CSLab",
    level: -59,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b0",
    SSID: "Smart-CAU",
    level: -59,
  },
  {
    BSSID: "f0:5c:19:a9:b6:b1",
    SSID: "eduroam",
    level: -60,
  },
  {
    BSSID: "30:23:03:90:3f:9c",
    SSID: "CSE514-2",
    level: -70,
  },
  {
    BSSID: "f0:5c:19:a9:c0:31",
    SSID: "eduroam",
    level: -78,
  },
  {
    BSSID: "30:23:03:90:3f:9b",
    SSID: "CSE514-2",
    level: -73,
  },
  {
    BSSID: "58:86:94:46:49:62",
    SSID: "VRLABONLY",
    level: -59,
  },
  {
    BSSID: "58:86:94:46:49:60",
    SSID: "VRLABONLY5G",
    level: -61,
  },
  {
    BSSID: "70:5d:cc:6f:9d:52",
    SSID: "Data Science Lab",
    level: -69,
  },
  {
    BSSID: "3c:a3:15:01:57:16",
    SSID: "sysganda_5g",
    level: -75,
  },
  {
    BSSID: "88:36:6c:60:08:04",
    SSID: "iptime",
    level: -79,
  },
  {
    BSSID: "58:86:94:ae:4f:4e",
    SSID: "iptime",
    level: -83,
  },
  {
    BSSID: "f0:5c:19:a9:b8:a2",
    SSID: "Smart-CAU_2.4G",
    level: -51,
  },
  {
    BSSID: "f0:5c:19:a9:b8:a1",
    SSID: "eduroam",
    level: -52,
  },
  {
    BSSID: "f0:5c:19:a9:bf:71",
    SSID: "eduroam",
    level: -82,
  },
  {
    BSSID: "e8:9f:80:56:2f:01",
    SSID: "208-506",
    level: -83,
  },
  {
    BSSID: "e8:9f:80:56:2f:02",
    SSID: "208-506",
    level: -78,
  },
  {
    BSSID: "3a:22:e2:8c:42:c5",
    SSID: "DIRECT-C5-HP M479dw Color LJ",
    level: -60,
  },
  {
    BSSID: "86:2a:fd:f0:b9:da",
    SSID: "DIRECT-DA-HP ",
    level: -70,
  },
  {
    BSSID: "f0:5c:19:a9:c0:a1",
    SSID: "eduroam",
    level: -76,
  },
];
