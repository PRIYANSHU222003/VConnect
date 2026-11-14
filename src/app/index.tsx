import React, {useState } from "react";
import {
  View, Text, TextInput, ScrollView, Pressable,
  StyleSheet, SafeAreaView, Image
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import QRCode from "react-native-qrcode-svg";

const COLORS = {
  pink: "#E1306C",
  purple: "#833AB4",
  orange: "#F77737",
  background: "#FAF8FC",
  text: "#241B2F",
  muted: "#857B8D",
  white: "#FFFFFF",
};

const USER = {
  id: "vc_demo_user_001",
  name: "V connect user",
  username: "@vconnect_user",
  bio: "Making new connections, one scan at a time ✨",
};

const SAMPLE_POSTS = [
  {
    id: "1",
    name: "Maya Sharma",
    username: "@maya",
    caption: "Collect moments, not things ✨",
    color: "#F5D9EF",
  },
  {
    id: "2",
    name: "Alex Morgan",
    username: "@alexmorgan",
    caption: "New friends, new adventures 🌍",
    color: "#DCD8FA",
  },
  {
    id: "3",
    name: "Alexa",
    username: "@alexa",
    caption: "New friends, world adventure 🌍",
    color: "#DCD8FA",
  },
];

type Tab = "Home" | "Scan" | "My QR" | "Chats" | "Profile";

export default function App() {
  const [tab, setTab] = useState<Tab>("Home");
  const [liked, setLiked] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [scanned, setScanned] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "Welcome to V connect! 👋",
  ]);
  const [message, setMessage] = useState("");
  const [permission, requestPermission] = useCameraPermissions();

  function handleScan(data: string) {
    setScanned(true);

    if (!data.startsWith("vconnect://user/")) {
      setScanResult("This is not a valid V connect profile QR.");
      return;
    }

    const userId = data.replace("vconnect://user/", "");

    if (userId === USER.id) {
      setScanResult("This is your own QR code!");
      return;
    }

    setFriends((old) =>
      old.includes(userId) ? old : [...old, userId]
    );
    setScanResult(`Connected! User ID: ${userId}`);
  }

  function sendMessage() {
    const value = message.trim();
    if (!value) return;
    setMessages((old) => [...old, value]);
    setMessage("");
  }

  function toggleLike(id: string) {
    setLiked((old) =>
      old.includes(id)
        ? old.filter((item) => item !== id)
        : [...old, id]
    );
  }

  function renderHome() {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Discover</Text>
        <Text style={styles.subtitle}>
          Your people. One scan away.
        </Text>

        <Pressable
          style={styles.hero}
          onPress={() => setTab("My QR")}
        >
          <Text style={styles.heroTitle}>Meet your people.</Text>
          <Text style={styles.heroText}>
            Scan a QR code and connect instantly.
          </Text>
          <Text style={styles.heroButton}>Show my QR </Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Your feed</Text>

        {SAMPLE_POSTS.map((post) => (
          <View key={post.id} style={styles.post}>
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {post.name[0]}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bold}>{post.name}</Text>
                <Text style={styles.muted}>{post.username}</Text>
              </View>
            </View>

            <View
              style={[styles.postImage, { backgroundColor: post.color }]}
            >
              <Text style={styles.postEmoji}>"✦"</Text>
              <Text style={styles.postCaption}>{post.caption}</Text>
            </View>

            <Pressable onPress={() => toggleLike(post.id)}>
              <Text style={styles.like}>
                {liked.includes(post.id) ? "❤️ Liked" : "♡ Like"}"·"{" "}
                {liked.includes(post.id) ? 13 : 12}
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    );
  }

  function renderQR() {
    const qrValue = `vconnect://user/${USER.id}`;

    return (
      <View style={styles.centerContent}>
        <Text style={styles.heading}>Your QR code</Text>
        <Text style={styles.subtitle}>
          Let people scan to find you.
        </Text>

        <View style={styles.qrCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>V</Text>
          </View>
          <Text style={styles.sectionTitle}>{USER.name}</Text>
          <Text style={styles.muted}>{USER.username}</Text>

          <View style={styles.qr}>
            <QRCode value={qrValue} size={210} />
          </View>

          <Text style={styles.muted}>
            Scan to connect on V connect
          </Text>
        </View>

        <Text style={styles.small}>
          Demo profile ID: {USER.id}
        </Text>
      </View>
    );
  }

  function renderScanner() {
    if (!permission) {
      return <Text>Checking camera permission...</Text>;
    }

    if (!permission.granted) {
      return (
        <View style={styles.centerContent}>
          <Text style={styles.heading}>Scan to connect</Text>
          <Text style={styles.subtitle}>
            Allow camera access to scan a friends QR code.
          </Text>
          <Pressable
            style={styles.button}
            onPress={requestPermission}
          >
            <Text style={styles.buttonText}>Enable camera</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.centerContent}>
        <Text style={styles.heading}>QR Scanner</Text>
        <Text style={styles.subtitle}>
          Point your camera at a V connect QR code.
        </Text>

        <View style={styles.cameraFrame}>
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={
              scanned ? undefined : ({ data }) => handleScan(data)
            }
          />
        </View>

        {scanResult ? (
          <View style={styles.resultCard}>
            <Text style={styles.bold}>{scanResult}</Text>
          </View>
        ) : null}

        {scanned && (
          <Pressable
            style={styles.button}
            onPress={() => {
              setScanned(false);
              setScanResult("");
            }}
          >
            <Text style={styles.buttonText}>Scan again</Text>
          </Pressable>
        )}
      </ScrollView>
    );
  }

  function renderChats() {
    return (
      <View style={styles.content}>
        <Text style={styles.heading}>Messages</Text>
        <Text style={styles.subtitle}>
          Your conversations on V connect
        </Text>

        <View style={styles.chatCard}>
          <Text style={styles.bold}>V connect chat demo</Text>
          <Text style={styles.muted}>
            Local preview "·" Not sent to another user
          </Text>

          <ScrollView style={{ maxHeight: 300 }}>
            {messages.map((item, index) => (
              <View key={index} style={styles.messageBubble}>
                <Text>{item}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.messageInputRow}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Write a message..."
              style={styles.input}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <Pressable style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.buttonText}>Send</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  function renderProfile() {
    return (
      <View style={styles.centerContent}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarLargeText}>V</Text>
        </View>
        <Text style={styles.heading}>{USER.name}</Text>
        <Text style={styles.muted}>{USER.username}</Text>
        <Text style={styles.profileBio}>{USER.bio}</Text>

        <View style={styles.stats}>
          <View>
            <Text style={styles.statNumber}>{friends.length}</Text>
            <Text style={styles.muted}>Connections</Text>
          </View>
          <View>
            <Text style={styles.statNumber}>{SAMPLE_POSTS.length}</Text>
            <Text style={styles.muted}>Feed posts</Text>
          </View>
          <View>
            <Text style={styles.statNumber}>{liked.length}</Text>
            <Text style={styles.muted}>Likes</Text>
          </View>
        </View>

        <Pressable
          style={styles.button}
          onPress={() => setTab("My QR")}
        >
          <Text style={styles.buttonText}>My QR code</Text>
        </Pressable>

        <Text style={styles.small}>User ID: {USER.id}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          V<Text style={{ color: COLORS.pink }}> connect</Text>
        </Text>
        <Text style={styles.headerIcon}>"♡"</Text>
      </View>

      <View style={{ flex: 1 }}>
        {tab === "Home" && renderHome()}
        {tab === "Scan" && renderScanner()}
        {tab === "My QR" && renderQR()}
        {tab === "Chats" && renderChats()}
        {tab === "Profile" && renderProfile()}
      </View>

      <View style={styles.bottomNav}>
        {([
          ["Home", "⌂"],
          ["Scan", "▦"],
          ["My QR", "▧"],
          ["Chats", "✉"],
          ["Profile", "○"],
        ] as [Tab, string][]).map(([name, icon]) => (
          <Pressable
            key={name}
            style={styles.navItem}
            onPress={() => {
              setTab(name);
              if (name === "Scan") {
                setScanned(false);
                setScanResult("");
              }
            }}
          >
            <Text
              style={[
                styles.navIcon,
                tab === name && styles.activeNav,
              ]}
            >
              {icon}
            </Text>
            <Text
              style={[
                styles.navLabel,
                tab === name && styles.activeNav,
              ]}
            >
              {name}
            </Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EAF3",
  },
  logo: {
    fontSize: 25,
    fontWeight: "900",
    color: COLORS.purple,
  },
  headerIcon: {
    fontSize: 30,
    color: COLORS.pink,
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 5,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginBottom: 20,
  },
  hero: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: COLORS.purple,
    marginBottom: 25,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "800",
  },
  heroText: {
    color: "#F5EAFB",
    marginTop: 8,
    fontSize: 15,
  },
  heroButton: {
    color: COLORS.white,
    fontWeight: "800",
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: COLORS.text,
    marginVertical: 12,
  },
  post: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 12,
    marginBottom: 18,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  avatar: {
    height: 42,
    width: 42,
    borderRadius: 22,
    backgroundColor: "#F3D8EF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    color: COLORS.purple,
    fontWeight: "800",
  },
  bold: {
    fontWeight: "700",
    color: COLORS.text,
  },
  muted: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 3,
  },
  postImage: {
    height: 220,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  postEmoji: {
    fontSize: 44,
    color: COLORS.purple,
  },
  postCaption: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  like: {
    color: COLORS.pink,
    fontWeight: "700",
    marginTop: 12,
    fontSize: 15,
  },
  centerContent: {
    flexGrow: 1,
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  qrCard: {
    backgroundColor: COLORS.white,
    width: "100%",
    alignItems: "center",
    padding: 24,
    borderRadius: 24,
    marginTop: 8,
    gap: 7,
  },
  qr: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    marginVertical: 12,
  },
  avatarLarge: {
    width: 82,
    height: 82,
    borderRadius: 42,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarLargeText: {
    color: COLORS.white,
    fontSize: 40,
    fontWeight: "900",
  },
  small: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 14,
    textAlign: "center",
  },
  cameraFrame: {
    width: 280,
    height: 320,
    overflow: "hidden",
    borderRadius: 22,
    backgroundColor: "#241B2F",
    marginVertical: 15,
  },
  resultCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    width: "100%",
  },
  button: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
  },
  chatCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 18,
    marginTop: 15,
  },
  messageBubble: {
    backgroundColor: "#F2E6F8",
    padding: 12,
    borderRadius: 14,
    alignSelf: "flex-end",
    marginTop: 12,
    maxWidth: "90%",
  },
  messageInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 15,
  },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 12,
    color: COLORS.text,
  },
  sendButton: {
    backgroundColor: COLORS.purple,
    padding: 12,
    borderRadius: 12,
  },
  profileBio: {
    marginTop: 12,
    textAlign: "center",
    color: COLORS.text,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 25,
  },
  statNumber: {
    fontWeight: "800",
    fontSize: 22,
    textAlign: "center",
    color: COLORS.text,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: "#EDE6F0",
    paddingTop: 10,
    paddingBottom: 8,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
    gap: 3,
  },
  navIcon: {
    fontSize: 23,
    color: COLORS.muted,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.muted,
  },
  activeNav: {
    color: COLORS.pink,
    fontWeight: "900",
  },
});