<?php
/**
 * SNEAK Evolution v2.1 - 2026
 * Credits: Original SNEAK v1.28 by Snarkles (snarkles.net)
 */

function query_rainbow($hash) {
    $url = "https://hash-toolkit.com/api/reversetest?hash=" . urlencode(trim($hash));
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $res = curl_exec($ch);
    curl_close($ch);
    return $res ?: "No match found in external tables.";
}

$output = "";
if (isset($_POST['submit'])) {
    $method = $_POST['method'];
    $data = $_POST['text'];
    $key = $_POST['key'] ?: 'default_key_32_chars_long_limit_!!';

    switch ($method) {
        case 'aes_enc':
            $iv = openssl_random_pseudo_bytes(16);
            $output = base64_encode($iv . openssl_encrypt($data, 'aes-256-cbc', $key, 0, $iv));
            break;
        case 'aes_dec':
            $data = base64_decode($data);
            $iv = substr($data, 0, 16);
            $output = openssl_decrypt(substr($data, 16), 'aes-256-cbc', $key, 0, $iv);
            break;
        case 'rainbow': $output = query_rainbow($data); break;
        case 'sha256': $output = hash('sha256', $data); break;
        case 'b64enc': $output = base64_encode($data); break;
        case 'b64dec': $output = base64_decode($data); break;
        case 'rot13':  $output = str_rot13($data); break;
        case 'hex2asc': $output = @pack("H*", str_replace(" ", "", $data)); break;
        case 'asc2hex': $output = chunk_split(bin2hex($data), 2, " "); break;
    }
}
?>
<!DOCTYPE html>
<html lang="en-GB">
<head>
    <meta charset="UTF-8">
    <title>SNEAK // mwilliams.cc</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
<?php include $_SERVER['DOCUMENT_ROOT'] . '/nav.php'; ?>
    <div style="font-size:1.2rem; letter-spacing:2px; margin-bottom:2rem;"><a href="/" style="color:#111; text-decoration:none;">MWILLIAMS.CC</a></div>
    <div style="font-variant:small-caps; font-size:0.9rem; color:#666; border-bottom:1px solid #ddd; margin-bottom:0.5rem;">Vibe Coding</div>
    <ul style="list-style:none; padding:0; margin:0 0 1rem 0;">
        <li style="margin:0.4rem 0;"><a href="/courtroom" style="color:#111; text-decoration:none; font-style:italic; font-size:0.95rem;">Courtroom Dramas</a></li>
        <li style="margin:0.4rem 0;"><a href="/sneak" style="color:#111; text-decoration:none; font-style:italic; font-size:0.95rem;">SNEAK</a></li>
    </ul>
    <div style="font-variant:small-caps; font-size:0.9rem; color:#666; border-bottom:1px solid #ddd; margin-bottom:0.5rem;">Security Research</div>
    <ul style="list-style:none; padding:0; margin:0 0 1rem 0;">
        <li style="margin:0.4rem 0;"><a href="/origins" style="color:#111; text-decoration:none; font-style:italic; font-size:0.95rem;">Origins</a></li>
        <li style="margin:0.4rem 0;"><a href="/llm" style="color:#111; text-decoration:none; font-style:italic; font-size:0.95rem;">LLM Research</a></li>
    </ul>
    <div style="font-variant:small-caps; font-size:0.9rem; color:#666; border-bottom:1px solid #ddd; margin-bottom:0.5rem;">External</div>
    <ul style="list-style:none; padding:0; margin:0;">
        <li style="margin:0.4rem 0;"><a href="https://github.com/itsmw666" target="_blank" style="color:#111; text-decoration:none; font-style:italic; font-size:0.95rem;">GitHub</a></li>
    </ul>
</nav>
<main>
    <h1>SNEAK Evolution</h1>
    <form method="post">
        <textarea name="text" rows="5" placeholder="Input string..."><?=htmlspecialchars($_POST['text']??'')?></textarea>
        <input type="text" name="key" placeholder="AES Key (Optional)" value="<?=htmlspecialchars($_POST['key']??'')?>">
        <select name="method">
            <option value="aes_enc">AES-256 Encrypt</option>
            <option value="aes_dec">AES-256 Decrypt</option>
            <option value="rainbow">External Rainbow Lookup</option>
            <option value="sha256">SHA-256 Hash</option>
            <option value="b64enc">Base64 Encode</option>
            <option value="b64dec">Base64 Decode</option>
            <option value="rot13">ROT-13</option>
            <option value="asc2hex">ASCII to Hex</option>
            <option value="hex2asc">Hex to ASCII</option>
        </select>
        <input type="submit" name="submit" value="EXECUTE" style="background:#000; color:#fff;">
    </form>
    <?php if ($output): ?>
        <div class="result"><?=htmlspecialchars($output)?></div>
    <?php endif; ?>
</main>
</body>
</html>
