"use client";
import Image from "next/image";
import Jack from "../../public/jack.png";
import Snowman from "../../public/snowman.png";
import React, { useState  } from "react";

export default function Home() {
  // Game Constants
  const MAX_HEALTH = 100;
  
  // Jack's Move Constants
  const QUICK_STRIKE_DAMAGE = 15;
  const POWER_SLASH_DAMAGE = 23;
  const POWER_SLASH_COOLDOWN = 3;
  const RIZZ_DAMAGE = 10;
  const CRITICAL_HIT_DAMAGE = 32;
  const CRITICAL_HIT_COOLDOWN = 4;
  
  // Snowman's Move Constants
  const SNOWBALL_THROW_DAMAGE = 18;
  const ICE_BLAST_DAMAGE = 28;
  const FROST_BITE_DAMAGE = 12;
  const BLIZZARD_STORM_DAMAGE = 40;

  const [snowmanHealth, setSnowmanHealth] = useState(MAX_HEALTH);
  const [jackHealth, setJackHealth] = useState(MAX_HEALTH);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [lastEnemyMove, setLastEnemyMove] = useState("");
  const [powerSlashCooldown, setPowerSlashCooldown] = useState(0);
  const [criticalHitCooldown, setCriticalHitCooldown] = useState(0);
  const [snowmanEnraged, setSnowmanEnraged] = useState(false);

  // Jack's moves
  function handleQuickStrike() {
    if (isPlayerTurn && snowmanHealth > 0) {
      setSnowmanHealth(Math.max(0, snowmanHealth - QUICK_STRIKE_DAMAGE));
      setIsPlayerTurn(false);
      setTimeout(() => enemyTurn(), 1000);
    }
  }

  function handlePowerSlash() {
    if (isPlayerTurn && snowmanHealth > 0 && powerSlashCooldown === 0) {
      setSnowmanHealth(Math.max(0, snowmanHealth - POWER_SLASH_DAMAGE));
      setPowerSlashCooldown(POWER_SLASH_COOLDOWN);
      setSnowmanEnraged(true); // Trigger enraged state
      setIsPlayerTurn(false);
      setTimeout(() => enemyTurn(), 1000);
    }
  }

  function handleRizz() {
    if (isPlayerTurn && snowmanHealth > 0) {
      setSnowmanHealth(Math.max(0, snowmanHealth - RIZZ_DAMAGE));
      setIsPlayerTurn(false);
      setTimeout(() => enemyTurn(), 1000);
    }
  }

  function handleCriticalHit() {
    if (isPlayerTurn && snowmanHealth > 0 && criticalHitCooldown === 0) {
      setSnowmanHealth(Math.max(0, snowmanHealth - CRITICAL_HIT_DAMAGE));
      setCriticalHitCooldown(CRITICAL_HIT_COOLDOWN);
      setSnowmanEnraged(true); // Trigger enraged state
      setIsPlayerTurn(false);
      setTimeout(() => enemyTurn(), 1000);
    }
  }

  // Snowman attacks automatically - no manual functions needed

  function enemyTurn() {
    if (jackHealth > 0 && snowmanHealth > 0) {
      let selectedMove;
      
      // Check if snowman is enraged (Jack used powerful move)
      if (snowmanEnraged) {
        // 50% chance to use Blizzard Storm when enraged
        if (Math.random() < 0.5) {
          selectedMove = { name: "Blizzard Storm", damage: BLIZZARD_STORM_DAMAGE, func: () => setJackHealth(prev => Math.max(0, prev - BLIZZARD_STORM_DAMAGE)) };
        } else {
          // Use normal weighted selection for the other 50%
          const moves = [
            { name: "Snowball Throw", damage: SNOWBALL_THROW_DAMAGE, weight: 40, func: () => setJackHealth(prev => Math.max(0, prev - SNOWBALL_THROW_DAMAGE)) },
            { name: "Ice Blast", damage: ICE_BLAST_DAMAGE, weight: 25, func: () => setJackHealth(prev => Math.max(0, prev - ICE_BLAST_DAMAGE)) },
            { name: "Frost Bite", damage: FROST_BITE_DAMAGE, weight: 45, func: () => setJackHealth(prev => Math.max(0, prev - FROST_BITE_DAMAGE)) }
          ];
          
          const totalWeight = moves.reduce((sum, move) => sum + move.weight, 0);
          let randomNum = Math.random() * totalWeight;
          selectedMove = moves[0];
          
          for (const move of moves) {
            randomNum -= move.weight;
            if (randomNum <= 0) {
              selectedMove = move;
              break;
            }
          }
        }
        // Reset enraged state after attack
        setSnowmanEnraged(false);
      } else {
        // Normal weighted selection when not enraged
        const moves = [
          { name: "Snowball Throw", damage: SNOWBALL_THROW_DAMAGE, weight: 40, func: () => setJackHealth(prev => Math.max(0, prev - SNOWBALL_THROW_DAMAGE)) },
          { name: "Ice Blast", damage: ICE_BLAST_DAMAGE, weight: 25, func: () => setJackHealth(prev => Math.max(0, prev - ICE_BLAST_DAMAGE)) },
          { name: "Frost Bite", damage: FROST_BITE_DAMAGE, weight: 45, func: () => setJackHealth(prev => Math.max(0, prev - FROST_BITE_DAMAGE)) },
          { name: "Blizzard Storm", damage: BLIZZARD_STORM_DAMAGE, weight: 10, func: () => setJackHealth(prev => Math.max(0, prev - BLIZZARD_STORM_DAMAGE)) }
        ];
        
        const totalWeight = moves.reduce((sum, move) => sum + move.weight, 0);
        let randomNum = Math.random() * totalWeight;
        selectedMove = moves[0];
        
        for (const move of moves) {
          randomNum -= move.weight;
          if (randomNum <= 0) {
            selectedMove = move;
            break;
          }
        }
      }
      
      setLastEnemyMove(`${selectedMove.name} - ${selectedMove.damage} damage`);
      selectedMove.func();
      
      // Reduce cooldowns after enemy turn (completing one full turn cycle)
      setPowerSlashCooldown(prev => Math.max(0, prev - 1));
      setCriticalHitCooldown(prev => Math.max(0, prev - 1));
      
      setIsPlayerTurn(true);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="text-center py-6 bg-slate-800 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">⚔️ Battle Showdown ⚔️</h1>
        <p className="text-lg opacity-90">Jack vs Snowman - Turn-Based Combat</p>
      </div>

      {/* Game Status */}
      <div className="text-center py-6">
        {jackHealth <= 0 && (
          <div className="text-4xl font-bold text-red-600 animate-pulse">
            🏆 Snowman Wins! ❄️
          </div>
        )}
        {snowmanHealth <= 0 && (
          <div className="text-4xl font-bold text-green-600 animate-pulse">
            🏆 Jack Wins! ⚔️
          </div>
        )}
        {jackHealth > 0 && snowmanHealth > 0 && (
          <div className="text-2xl font-semibold text-slate-700">
            {isPlayerTurn ? (
              <span className="text-blue-600">🎯 Jack's Turn - Choose your attack!</span>
            ) : (
              <span className="text-red-600">⚡ Snowman's Turn - Attacking automatically...</span>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-row items-start justify-center gap-8 px-4 pb-8">
        {/* Jack's Section */}
        <div className="w-[400px] flex justify-center flex-col items-center bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <div className="text-2xl font-bold text-blue-800 mb-2">⚔️ Jack</div>
          <Image src={Jack} alt="Picture of Jack" width={300} height={300} className="rounded-lg shadow-md" />
          
          {/* Jack's Health Bar */}
          <div className="w-full mt-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-slate-700">Health</span>
              <span className="text-lg font-bold text-blue-600">{jackHealth}/{MAX_HEALTH}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${jackHealth}%` }}
              ></div>
            </div>
          </div>
          
          {/* Jack's Moves */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">Combat Moves</h3>
            <div className="flex flex-col gap-3">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95" 
                onClick={handleQuickStrike}
                disabled={!isPlayerTurn || snowmanHealth <= 0}
              >
                ⚡ Quick Strike - {QUICK_STRIKE_DAMAGE} DMG
              </button>
              <button 
                className={`font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 ${
                  powerSlashCooldown > 0 
                    ? 'bg-red-300 text-red-800 cursor-not-allowed' 
                    : 'bg-purple-500 hover:bg-purple-600 text-white'
                }`}
                onClick={handlePowerSlash}
                disabled={!isPlayerTurn || snowmanHealth <= 0 || powerSlashCooldown > 0}
              >
                🗡️ Power Slash - {POWER_SLASH_DAMAGE} DMG {powerSlashCooldown > 0 ? `(${powerSlashCooldown} turns)` : ""}
              </button>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95" 
                onClick={handleRizz}
                disabled={!isPlayerTurn || snowmanHealth <= 0}
              >
                😎 Rizz - {RIZZ_DAMAGE} DMG
              </button>
              <button 
                className={`font-semibold py-3 px-4 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 ${
                  criticalHitCooldown > 0 
                    ? 'bg-red-300 text-red-800 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
                onClick={handleCriticalHit}
                disabled={!isPlayerTurn || snowmanHealth <= 0 || criticalHitCooldown > 0}
              >
                💥 Critical Hit - {CRITICAL_HIT_DAMAGE} DMG {criticalHitCooldown > 0 ? `(${criticalHitCooldown} turns)` : ""}
              </button>
            </div>
          </div>
        </div>
        {/* Snowman's Section */}
        <div className="w-[400px] flex justify-center flex-col items-center bg-white rounded-xl shadow-lg p-6 border-2 border-cyan-200">
          <div className="text-2xl font-bold text-cyan-800 mb-2">
            ❄️ Snowman {snowmanEnraged && <span className="text-red-600">😡</span>}
          </div>
          {snowmanEnraged && (
            <div className="text-sm font-bold text-red-600 mb-2 animate-pulse">
              ENRAGED! 50% chance of Blizzard Storm!
            </div>
          )}
          <Image src={Snowman} alt="Picture of Snowman" width={240} height={240} className="rounded-lg shadow-md" />
          
          {/* Snowman's Health Bar */}
          <div className="w-full mt-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-slate-700">Health</span>
              <span className="text-lg font-bold text-cyan-600">{snowmanHealth}/{MAX_HEALTH}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${snowmanHealth}%` }}
              ></div>
            </div>
          </div>

          {/* Enemy Moves Info */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-slate-700 mb-3 text-center">Enemy Moves (Auto)</h3>
            <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
              <div className="text-sm text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>❄️ Snowball Throw</span>
                  <span className="font-semibold">{SNOWBALL_THROW_DAMAGE} DMG</span>
                </div>
                <div className="flex justify-between">
                  <span>🧊 Ice Blast</span>
                  <span className="font-semibold">{ICE_BLAST_DAMAGE} DMG</span>
                </div>
                <div className="flex justify-between">
                  <span>🥶 Frost Bite</span>
                  <span className="font-semibold">{FROST_BITE_DAMAGE} DMG</span>
                </div>
                <div className="flex justify-between">
                  <span>🌨️ Blizzard Storm</span>
                  <span className="font-semibold">{BLIZZARD_STORM_DAMAGE} DMG</span>
                </div>
              </div>
            </div>
            
            {lastEnemyMove && (
              <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                <div className="text-center">
                  <div className="text-sm font-semibold text-red-700">Last Attack:</div>
                  <div className="text-sm text-red-600 font-bold">{lastEnemyMove}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
