
const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const GAME_WIDTH = canvas.width;
    const GAME_HEIGHT = canvas.height;
    const playerImg = new Image();
playerImg.src = 'player.png'; 
const enemyImg = new Image();
enemyImg.src = 'enemy.png';
const HPImg = new Image();
HPImg.src = 'hp_supply.png';
const SHIELDImg = new Image();
SHIELDImg.src = 'shield_supply.png';

    let game = {
        state: 'running', 
        score: 0,
        frames: 0
    };
const keys = new Set();
  
    window.addEventListener('keydown', e => {
      
        if(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();}
        keys.add(e.code);
        if (e.code === 'KeyP') toggleShop();
       
        if (game.state === 'shop') {
            
            if (e.key === '1') {
                let upgradeCost = player.weaponLevel * 500; 
                if (player.weaponLevel >= 5) {
                    alert('Weapon Max Level Reached!');
                } else if (game.score >= upgradeCost) {
                    game.score -= upgradeCost;
                    player.weaponLevel++;
                    alert(`Weapon Upgraded to Lv ${player.weaponLevel}!`);
                    draw();
                } else {
                    alert(`Not enough score! Need ${upgradeCost}`);
                }}
            
            if (e.key === '2') {
                let cost = 300;
                if (player.speed >= 12) {
                    alert('Max Speed Reached!');
                } else if (game.score >= cost) {
                    game.score -= cost;
                    player.speed += 1;
                    alert(`Speed Up! Current Speed: ${player.speed}`);
                    draw();
                } else {
                    alert(`Not enough score! Need ${cost}`);
                }}

            
            if (e.key === '3') {
                let cost = 200;
                if (player.hp >= 100) {
                    alert('HP is full!');
                } else if (game.score >= cost) {
                    game.score -= cost;
                    player.hp = Math.min(player.hp + 30, 100);
                    alert(`Repaired! Current HP: ${player.hp}%`);
                    draw();
                } else {
                    alert(`Not enough score! Need ${cost}`);
                }}}
    });

    window.addEventListener('keyup', e => {
        keys.delete(e.code);
    });


    class Entity {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.markedForDeletion = false;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        update() {}
    }

    class Player extends Entity {
        constructor() {
            super(GAME_WIDTH / 2 - 25, GAME_HEIGHT - 60, 50, 50, '#00f0ff');
            this.speed = 5;
            this.hp = 100;
            this.shootTimer = 0;
            this.shootInterval = 15;
            this.weaponLevel = 1; 
            this.myShild = 0; 
        }

        update() {
            
            if (keys.has('ArrowUp') || keys.has('KeyW')) this.y -= this.speed;
            if (keys.has('ArrowDown') || keys.has('KeyS')) this.y += this.speed;
            if (keys.has('ArrowLeft') || keys.has('KeyA')) this.x -= this.speed;
            if (keys.has('ArrowRight') || keys.has('KeyD')) this.x += this.speed;

           
            if (this.x < 0) this.x = 0;
            if (this.x > GAME_WIDTH - this.width) this.x = GAME_WIDTH - this.width;
            if (this.y < 0) this.y = 0;
            if (this.y > GAME_HEIGHT - this.height) this.y = GAME_HEIGHT - this.height;

       
            if (keys.has('Space')) {
                if (this.shootTimer === 0) {
                    this.shoot();
                    this.shootTimer = this.shootInterval;
                }
            }
            if (this.shootTimer > 0) this.shootTimer--;

           
            if (this.myShild === 1) {
                ctx.fillStyle = 'rgba(0, 255, 255, 0.7)'; 
                ctx.font = '40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText("SHIELD ACTIVE", this.x + this.width/2, this.y - 10); 
            }
        }

        shoot() {
            let center = this.x + this.width / 2 - 2.5;
            switch (this.weaponLevel) {
                case 1: 
                    bullets.push(new Bullet(center, this.y));
                    break;
                case 2: 
                    bullets.push(new Bullet(this.x, this.y)); 
                    bullets.push(new Bullet(this.x + this.width - 5, this.y));
                    break;
                case 3:
                    bullets.push(new Bullet(center, this.y, 0));
                    bullets.push(new Bullet(center, this.y, -2));
                    bullets.push(new Bullet(center, this.y, 2));
                    break;
                case 4:
                    bullets.push(new Bullet(center - 10, this.y, -1)); 
                    bullets.push(new Bullet(center + 10, this.y, 1));  
                    bullets.push(new Bullet(center, this.y, -3));
                    bullets.push(new Bullet(center, this.y, 3));
                    break;
                default: 
                     bullets.push(new Bullet(center, this.y, 0));
                     bullets.push(new Bullet(center, this.y, -2)); 
                     bullets.push(new Bullet(center, this.y, 2));  
                     bullets.push(new Bullet(center, this.y, -4)); 
                     bullets.push(new Bullet(center, this.y, 4));  
                     break;
            }
        }

        draw() {
            if (playerImg.complete) {
                ctx.drawImage(playerImg, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
          
            if (game.frames % 10 < 5) {
                ctx.fillStyle = 'orange';
                ctx.fillRect(this.x + this.width/2 - 5, this.y + this.height, 10, 10);
            }

            
            if (this.myShild === 1) { 
                ctx.save();
                ctx.strokeStyle = '#00ffff'; 
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x + this.width/2, this.y + this.height/2, 40, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }
    }    class Bullet extends Entity {
        constructor(x, y, vx = 0) {
            super(x, y, 5, 15, '#ffff00');
            this.speed = 10;
            this.vx = vx;
        }
        update() {
            this.y -= this.speed;
            this.x += this.vx;
            if (this.y < 0 || this.x < 0 || this.x > GAME_WIDTH) this.markedForDeletion = true;
        }}
    class Enemy extends Entity {
        constructor() {
            let size = 40;
            let x = Math.random() * (GAME_WIDTH - size);
            super(x, -size, size, size, '#ff0055');
            this.speed = Math.random() * 3 + 2;
            this.speedX = Math.random() * 2 - 1;
            this.shootTimer = Math.floor(Math.random() * 100);
        }
        update() {
            this.y += this.speed;
            this.x += this.speedX;
            if (this.x < 0 || this.x > GAME_WIDTH - this.width) this.speedX *= -1;
            if (this.y > GAME_HEIGHT) this.markedForDeletion = true;
            this.shootTimer++;
            if (this.shootTimer > 120 && this.y > 0 && this.y < GAME_HEIGHT - 100) {
                enemyBullets.push(new EnemyBullet(this.x + this.width/2, this.y + this.height));
                this.shootTimer = 0; 
            }}
            
        
        draw() {
            if (enemyImg.complete) {
                ctx.drawImage(enemyImg, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }




    class Particle extends Entity {
        constructor(x, y, color) {
            super(x, y, Math.random() * 4 + 2, Math.random() * 4 + 2, color);
            this.speedX = (Math.random() - 0.5) * 10;
            this.speedY = (Math.random() - 0.5) * 10;//隨機XY速度
            this.life = 1.0;
            this.decay = Math.random() * 0.05 + 0.02;//隨機衰弱週期
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
            if (this.life <= 0) this.markedForDeletion = true;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;//利用降低透明度達到消失效果
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    }



    class EnemyBullet extends Entity {
        constructor(x, y) {
            super(x, y, 6, 12, '#ff3300'); 
            this.speed = 6; 
        }

        update() {
            this.y += this.speed; 
            if (this.y > GAME_HEIGHT) this.markedForDeletion = true;
        }
    }

   
    class Supply extends Entity {
        constructor(x, y, type) {
            super(x, y, 30, 30, '#00ff00');
            this.speed = 2;
            this.type = type;
            this.text = '';
            if (this.type === 'HP') {
                this.color = '#00ff00'; 
                this.text = '+HP';
            } else if (this.type === 'SHIELD') {
                this.color = '#ffff00'; 
                this.text = 'Shield';
            }
        }

        update() {
            this.y += this.speed;
            
            this.x += Math.sin(game.frames / 20) * 2;

            if (this.y > GAME_HEIGHT) this.markedForDeletion = true;
        }

        draw() {
            if (HPImg.complete&& this.type === 'HP') {
                ctx.drawImage(HPImg, this.x, this.y, this.width, this.height);
                
            } else if (SHIELDImg.complete&& this.type === 'SHIELD') {
                ctx.drawImage(SHIELDImg, this.x, this.y, this.width, this.height);
            } else {
               ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x + 15, this.y + 15, 15, 0, Math.PI * 2);
            ctx.fill();
            
            }
            
         
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(this.text, this.x + 5, this.y + 20);
        }
    }
  

    const player = new Player();
    let bullets = [];
    let enemies = [];
    let particles = [];
    let enemyBullets = []; 
    let supplies = [];
    let enemyTimer = 0;
    let enemyInterval = 60;

        
    function checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
        );
    }

    function toggleShop() {
        if (game.state === 'running') {
            game.state = 'shop';
        } else if (game.state === 'shop') {
            game.state = 'running';
            animate();
        }
    }

function update() {
        if (game.state !== 'running') return;
        player.update();
        bullets = bullets.filter(b => !b.markedForDeletion);
        bullets.forEach(b => b.update()); 
        let currentInterval = Math.max(10,enemyInterval-(player.weaponLevel-1)*10);
       
        if (enemyTimer > currentInterval) {
            enemies.push(new Enemy());
            enemyTimer = 0;
        } else {
            enemyTimer++;
        }

        enemyBullets = enemyBullets.filter(eb => !eb.markedForDeletion);
        enemyBullets.forEach(eb => {
            eb.update();
            eb.draw(); 

            
            if (checkCollision(player, eb)) {
                
                if (player.myShild === 1) { 
                    eb.markedForDeletion = true; 
                    player.myShild = 0;         
                    return;
                }

                player.hp -= 5; 
                eb.markedForDeletion = true;
                
                for(let i=0; i<5; i++) particles.push(new Particle(player.x+25, player.y+25, '#ff0000'));
                
                if (player.hp <= 0) {
                     game.state = 'gameover';
                     setTimeout(() => {
                        alert(`GAME OVER! Final Score: ${game.score}`);
                        document.location.reload();
                    }, 100);
                }
            }
        });

        supplies = supplies.filter(s => !s.markedForDeletion);
        supplies.forEach(s => {
            s.update();
            

            if (checkCollision(player, s)) {
                s.markedForDeletion = true; 
                
                if (s.type === 'HP') {
                    player.hp = Math.min(player.hp + 20, 100); 
                    console.log("Healed!"); 
                } else if (s.type === 'SHIELD') {
                    player.myShild = 1; 
                }
            }
        });

        enemies = enemies.filter(e => !e.markedForDeletion);
        enemies.forEach(enemy => {
            enemy.update();
            if (checkCollision(player, enemy)) {
                if (player.myShild === 1) {
                    enemy.markedForDeletion = true; 
                    player.myShild = 0;             
                    for (let i = 0; i < 10; i++) {
                        particles.push(new Particle(enemy.x, enemy.y, '#ff0000'));
                    }
                    return;
                }
                player.hp -= 10;
                enemy.markedForDeletion = true; 
                for (let i = 0; i < 10; i++) {
                    particles.push(new Particle(enemy.x, enemy.y, '#ff0000'));
                }

                if (player.hp <= 0) {
                    game.state = 'gameover';
                    setTimeout(() => {
                        alert(`GAME OVER! Final Score: ${game.score}`);
                        document.location.reload();
                    }, 100);
                }
            }

         
            bullets.forEach(bullet => {
                if (!bullet.markedForDeletion && checkCollision(bullet, enemy)) {
                    bullet.markedForDeletion = true;
                    enemy.markedForDeletion = true;
                    game.score += 100;
                    
                    for(let i=0; i<15; i++) particles.push(new Particle(enemy.x, enemy.y, enemy.color));

                    if (Math.random() <0.3) {
                        let type = Math.random() < 0.7 ? 'HP' : 'SHIELD';
                        supplies.push(new Supply(enemy.x, enemy.y, type));
                    }
                }
            });
        });

        
        particles = particles.filter(p => !p.markedForDeletion);
        particles.forEach(p => p.update());

        game.frames++;
        document.getElementById('scoreVal').innerText = game.score;
        document.getElementById('hpVal').innerText = player.hp;
    }
    function draw() {
        ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        player.draw();
        bullets.forEach(b => b.draw());
        enemies.forEach(e => e.draw());
        particles.forEach(p => p.draw());
        supplies.forEach(s => s.draw());
        enemyBullets.forEach(eb => eb.draw());

        if (game.state === 'shop') {
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
            ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

            ctx.save();
            ctx.shadowBlur = 20;           
            ctx.shadowColor = '#00f0ff';    
            ctx.strokeStyle = '#00f0ff';    
            ctx.lineWidth = 3;
            
            let boxW = 600;
            let boxH = 500;
            let boxX = (GAME_WIDTH - boxW) / 2;
            let boxY = (GAME_HEIGHT - boxH) / 2;
            
            ctx.strokeRect(boxX, boxY, boxW, boxH); 
          
            ctx.fillStyle = 'rgba(0, 20, 50, 0.9)';
            ctx.fillRect(boxX, boxY, boxW, boxH);
            ctx.restore(); 

            ctx.textAlign = 'center';
            ctx.fillStyle = '#00f0ff';
            ctx.font = 'bold 40px Arial';
            ctx.fillText("SYSTEM UPGRADE", GAME_WIDTH / 2, boxY + 60);
            
            
            ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
            ctx.beginPath();
            ctx.moveTo(boxX + 50, boxY + 80);
            ctx.lineTo(boxX + boxW - 50, boxY + 80);
            ctx.stroke();

            
            ctx.fillStyle = '#ffcc00'; 
            ctx.font = '24px Arial';
            ctx.fillText(`CREDITS: $${game.score}`, GAME_WIDTH / 2, boxY + 120);

            
            ctx.textAlign = 'left'; 
            let startX = boxX + 80;
            let startY = boxY + 180;
            let gap = 80; 

            
            let weaponCost = player.weaponLevel * 500;
            let wColor = 'gray';
            if (player.weaponLevel >= 5) wColor = '#ffd700'; 
            else if (game.score >= weaponCost) wColor = 'white'; 
            else wColor = '#ff4444'; 
            ctx.fillStyle = wColor;
            ctx.font = '22px Arial';
            if (player.weaponLevel >= 5) {
                ctx.fillText(`[1] WEAPON SYSTEM: MAX LEVEL`, startX, startY);
            } else {
                ctx.fillText(`[1] UPGRADE WEAPON (Lv${player.weaponLevel}→${player.weaponLevel+1})`, startX, startY);
               
                ctx.textAlign = 'right';
                ctx.fillText(`$${weaponCost}`, boxX + boxW - 80, startY);
                ctx.textAlign = 'left'; 
            }
         
            if (playerImg.complete) ctx.drawImage(playerImg, startX - 50, startY - 25, 30, 30);


     
            let speedCost = 300;
            let sColor = 'gray';
            if (player.speed >= 12) sColor = '#ffd700';
            else if (game.score >= speedCost) sColor = 'white';
            else sColor = '#ff4444';

            ctx.fillStyle = sColor;
            if (player.speed >= 12) {
                ctx.fillText(`[2] ENGINE THRUSTER: MAX`, startX, startY + gap);
            } else {
                ctx.fillText(`[2] SPEED UP (+1)`, startX, startY + gap);
                ctx.textAlign = 'right';
                ctx.fillText(`$${speedCost}`, boxX + boxW - 80, startY + gap);
                ctx.textAlign = 'left';
            }
         
             ctx.fillStyle = sColor;
             ctx.beginPath();
             ctx.moveTo(startX - 35, startY + gap);
             ctx.lineTo(startX - 45, startY + gap - 10);
             ctx.lineTo(startX - 45, startY + gap + 10);
             ctx.fill();


           
            let repairCost = 200;
            let rColor = 'gray';
            if (player.hp >= 100) rColor = '#00ff00'; 
            else if (game.score >= repairCost) rColor = 'white';
            else rColor = '#ff4444';

            ctx.fillStyle = rColor;
            if (player.hp >= 100) {
                ctx.fillText(`[3] HULL REPAIR: FULL (100%)`, startX, startY + gap * 2);
            } else {
                ctx.fillText(`[3] EMERGENCY REPAIR (+30 HP)`, startX, startY + gap * 2);
                ctx.textAlign = 'right';
                ctx.fillText(`$${repairCost}`, boxX + boxW - 80, startY + gap * 2);
                ctx.textAlign = 'left';
            }
            
            if (HPImg.complete) ctx.drawImage(HPImg, startX - 50, startY + gap * 2 - 25, 30, 30);


           
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; 
            ctx.font = '16px Arial';
            ctx.fillText("- PRESS 'P' TO RESUME MISSION -", GAME_WIDTH / 2, boxY + boxH - 40);
            
            ctx.textAlign = 'start'; 
        }
    }

    function animate() {
        if (game.state === 'running') {
            update();
            draw();
            requestAnimationFrame(animate);
        } else if (game.state === 'shop') {
            draw();
        }
    }

    animate();