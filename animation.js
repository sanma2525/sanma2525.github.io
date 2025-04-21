const moveCircle = (el) => {
  // 現在の計算済みスタイル（位置）を取得
  const style = window.getComputedStyle(el);
  const currentTransform = style.transform !== 'none' ? style.transform : 'translate(0, 0)';

  // 次のランダムな目的地を生成
  const nextX = Math.random() * -80 + "vw";
  const nextY = Math.random() * -80 + "vh";
  const nextSize = Math.random() * 60 + 50 + "vw";
  console.log(`移動ベクトル: (${nextX}, ${nextY})`);

  // アニメーション実行
  const animation = el.animate([
    // From: 現在の状態（前回の終点）
    { transform: currentTransform, width: el.style.width, height: el.style.height },
    // To: 新しい目的地
    { transform: `translate(${nextX}, ${nextY})`, width: nextSize, height: nextSize }
  ], {
    duration: Math.random() * 5000 + 8000, // 8~13秒で変動
    easing: 'ease-in-out',
    fill: 'forwards' // 終了時の状態を維持
  });

  // アニメーションが終わったら、自分自身を再度呼び出す（再帰）
  animation.onfinish = () => moveCircle(el);
};

// すべての円に適用
document.querySelectorAll('.circle1, .circle2, .circle3, .circle4').forEach(moveCircle);

const toggle = document.getElementById('darkModeToggle');
function toggleDarkMode() {
    if(toggle.checked) {
        document.documentElement.style.setProperty('--bg-color', '#181818');
        document.documentElement.style.setProperty('--text-color', '#ffffff');
        document.documentElement.style.setProperty('--transparent-bg', 'rgba(50, 50, 50, 0.5)');
        document.documentElement.style.setProperty('--transparent-bg-contents', 'rgba(50, 50, 50, 0.1)');
    } else {
        document.documentElement.style.setProperty('--bg-color', '#fff');
        document.documentElement.style.setProperty('--text-color', '#000');
        document.documentElement.style.setProperty('--transparent-bg', 'rgba(255, 255, 255, 0.5)');
        document.documentElement.style.setProperty('--transparent-bg-contents', 'rgba(255, 255, 255, 0.1)');
    }
}